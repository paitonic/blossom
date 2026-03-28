import { mount, unmount } from "svelte";
import BlossomButton from "./views/BlossomButton.svelte";
import Popover from "./views/Popover.svelte";
import { popover } from "./views/popover.svelte.js";
import { storage } from "@/shared/storage.svelte.js";
import { migrate } from "@/shared/migrations";

const mountsPullRequestListPage = {};
const mountsPullRequestPage = {};
let popoverMount = null;

const normalizeURL = (url) => {
  try {
    const newURL = new URL(url);
    return newURL.origin + newURL.pathname;
  } catch (e) {
    return url;
  }
};

const getPullRequestKey = (url) => {
  const parts = url.split("/");
  // Expected format: https://github.com/user/repo/pull/id
  // parts: ["https:", "", "github.com", "user", "repo", "pull", "id"]
  if (parts.length >= 7) {
    const user = parts[3];
    const repository = parts[4];
    const pullRequestID = parts[6];
    return `${user}/${repository}/${pullRequestID}`;
  }
  return url;
};

const getPRTitle = () => {
  const selectors = [
    '#diff-comparison-viewer-container .markdown-title'
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim()) return el.innerText.trim();
  }
  return "Unknown Pull Request";
};

const getPROpenedAt = () => {
  const selectors = [
    'div[id^="pullrequest-"] relative-time',
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const dt = el?.getAttribute("datetime");
    if (dt) return dt;
  }
  return new Date().toISOString();
};

const getPRAuthor = () => {
    const selectors = [
      '#diff-comparison-viewer-container div[class^="prc-PageHeader-Description"] a[data-hovercard-type="user"]'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    return "-";
}

const mountPopover = () => {
  let host = document.getElementById("blossom-extension-popover");

  if (host && popoverMount) {
    return;
  }

  if (host) {
    host.remove();
  }

  if (popoverMount) {
    try {
      unmount(popoverMount);
    } catch (e) {
      // ignore
    }
    popoverMount = null;
  }

  host = document.createElement("div");
  host.id = "blossom-extension-popover";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  popoverMount = mount(Popover, {
    target: shadow,
  });
};

let mounting = false;
const mountExtension = async () => {
  if (mounting) return;
  mounting = true;
  try {
    await mountInPullRequestList();
    await mountInPullRequestView();
    mountPopover();
  } catch (e) {
    console.error("blossom: failed to mount extension", e);
  } finally {
    mounting = false;
  }
};

const mountInPullRequestList = async () => {
  const links = document.querySelectorAll('a[id*="issue_"][id*="_link"]');
  if (links.length === 0) return;

  const linkData = [];
  const keys = [];

  for (const element of links) {
    const url = normalizeURL(element.href);
    const key = getPullRequestKey(url);
    keys.push(key);
    linkData.push({ element, url, key });
  }

  const ratings = await storage.kbatch(keys);

  for (const { element, url, key } of linkData) {
    const openedBy = element.parentNode?.querySelector(".opened-by")?.parentNode;
    if (!openedBy) continue;

    const openedAt = openedBy.querySelector("relative-time")?.getAttribute("datetime");
    const author = openedBy.querySelector('a[title^="Open pull requests created by"]')?.innerText || ''
    const title = element.innerText;

    let target = element.parentNode?.querySelector(".blossom__button--list");

    if (target && mountsPullRequestListPage[url]) {
      continue;
    }

    if (target) {
      if (mountsPullRequestListPage[url]) {
        unmount(mountsPullRequestListPage[url]);
      }
      target.replaceChildren();
    } else {
      target = document.createElement("span");
      target.className = "blossom__button blossom__button--list";
      openedBy.appendChild(target);
    }

    const button = mount(BlossomButton, {
      target,
      props: {
        pullRequestURL: url,
        title,
        openedAt,
        rated: !!ratings[key],
        author
      }
    });

    mountsPullRequestListPage[url] = button;
  }
}

const mountInPullRequestView = async () => {
  const firstComment = document.querySelector(
    '.pull-discussion-timeline a[id*="issue-"][id*="-permalink"]',
  );

  if (!firstComment) return;

  const link = normalizeURL(window.location.href);
  const key = getPullRequestKey(link);

  if (mountsPullRequestPage[link]) {
    if (document.querySelector(".blossom__button--detail")) {
      return;
    }
    unmount(mountsPullRequestPage[link]);
    delete mountsPullRequestPage[link];
  }

  const title = getPRTitle();
  const openedAt = getPROpenedAt();
  const author = getPRAuthor();
  const rating = await storage.kget(key);

  const mountTo = document.querySelector(
    'div[id^="pullrequest-"] .timeline-comment-actions',
  );
  if (!mountTo) return;

  const target = document.createElement("span");
  target.className = "blossom__button blossom__button--detail";
  mountTo.prepend(target);

  const button = mount(BlossomButton, {
    target,
    props: {
      withLabel: false,
      pullRequestURL: link,
      title,
      openedAt,
      rated: !!rating,
      author,
    },
  });

  mountsPullRequestPage[link] = button;
}

const unmountAll = () => {
  popover.close();

  if (popoverMount) {
    unmount(popoverMount);
    popoverMount = null;
  }

  const host = document.getElementById("blossom-extension-popover");
  if (host) {
    host.remove();
  }

  for (const k of Object.keys(mountsPullRequestListPage)) {
    unmount(mountsPullRequestListPage[k]);
    delete mountsPullRequestListPage[k];
  }

  for (const k of Object.keys(mountsPullRequestPage)) {
    unmount(mountsPullRequestPage[k]);
    delete mountsPullRequestPage[k];
  }
};

const main = async () => {
  await migrate();

  const style = document.createElement("style");
  style.textContent = `
    .blossom__button {
      display: inline-flex;
    }

    .blossom__button--list {
      display: inline-flex;
      margin-left: 0.25rem;
    }

    .blossom__button--detail {
      margin-right: 0.25rem;
    }

    @keyframes pageReady { from { opacity: 0.99; } to { opacity: 1; } }

    .js-navigation-container.js-active-navigation-container,
    .pull-discussion-timeline.js-pull-discussion-timeline {
        animation-duration: 0.001s;
        animation-name: pageReady;
      }
  `;
  document.head.appendChild(style);

  document.addEventListener(
    "animationstart",
    (event) => {
      if (event.animationName === "pageReady") {
        mountExtension();
      }
    },
    true,
  );

  document.addEventListener("turbo:load", mountExtension);
  document.addEventListener("turbo:render", mountExtension);

  document.addEventListener("turbo:before-visit", unmountAll);
  document.addEventListener("turbo:before-cache", unmountAll);
  window.addEventListener("popstate", unmountAll);
};

main();
