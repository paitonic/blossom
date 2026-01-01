import { mount, unmount } from "svelte";
import BlossomButton from "./views/BlossomButton.svelte";
import Popover from "./views/Popover.svelte";

const mounts = {};

const normalizeURL = (url) => {
  const newURL = new URL(url);
  return newURL.origin + newURL.pathname;
};

const mountPopover = () => {
  const body = document.querySelector("body");

  let target = document.querySelector(".blossom-extension-popup");
  if (target) {
    console.log("popup already mounted");
  } else {
    console.log("mounting popup");
    target = document.createElement("div");
    target.className = "blossom-extension-popup";
    const shadowRoot = target.attachShadow({ mode: "open" });
    body?.appendChild(target);
    mount(Popover, { target: shadowRoot });
  }
};

const mountExtension = () => {
  console.log("mounting extension");

  // mount on Pull Requests list page
  const links = document.querySelectorAll('a[id*="issue_"][id*="_link"]');
  for (const element of links) {
    const id = element.id.split("_")[1];
    const title = element.innerText;
    // console.log(`issue ${id} ${title}`);
    const openedBy =
      element.parentNode?.querySelector(".opened-by")?.parentNode;
    if (!openedBy) {
      throw new Error(
        'blossom: could not find ".opened-by" element on Pull Requests page',
      );
    }

    const openedAt = openedBy
      .querySelector("relative-time")
      ?.getAttribute("datetime");

    let target = element.parentNode?.querySelector(".blossom-extension-button");
    if (target && mounts[element.href]) {
      // button was already mounted before
      // lets cleanup before re-mounting
      unmount(mounts[element.href]);
      target.replaceChildren();
    } else {
      target = document.createElement("span");
      target.className = "blossom-extension-button";
      target.style.display = "inline-flex";
      target.style.marginLeft = "4px";
      openedBy.appendChild(target);
    }

    const button = mount(BlossomButton, {
      target,
      props: {
        pullRequestURL: normalizeURL(element.href),
        title,
        openedAt,
      },
    });

    mounts[element.href] = button;
  }

  // mount on Pull Request page
  const firstComment = document.querySelector(
    '.pull-discussion-timeline a[id*="issue-"][id*="-permalink"]',
  );

  if (firstComment) {
    // const pullRequestPage = firstComment.parentNode;

    const datetimeElement = document.querySelector(
      'div[id^="pullrequest-"] relative-time',
    );
    const link = window.location.href;
    const title = document.querySelector(
      "#partial-discussion-header .markdown-title",
    ).innerText;
    const openedAtElement = document.querySelector(
      'div[id^="pullrequest-"] relative-time',
    );
    const openedAt = openedAtElement.getAttribute("datetime");

    let target = firstComment.querySelector(".blossom-extension");
    if (target) {
      throw new Error("blossom: extension is already mounted!");
    } else {
      target = document.createElement("span");
      target.className = "blossom-extension-button";
      target.style.display = "inline-flex";
      target.style.marginLeft = "4px";

      const mountTo = document.querySelector(
        'div[id^="pullrequest-"] .timeline-comment-actions',
      );
      mountTo?.prepend(target);
    }

    console.log("view pull request: ", link, title, openedAt);
    mount(BlossomButton, {
      target,
      props: {
        withLabel: false,
        pullRequestURL: normalizeURL(link),
        title,
        openedAt,
      },
    });
  }

  mountPopover();
};

const main = () => {
  // This handles extension mounting on page load and re-mounting on page navigation.
  // Browser will trigger "animationstart" event when CSS selector matched DOM element.
  // When that event happens, we know the element we are looking for exist in DOM and we can mount the extension.
  // Other ways to handle this have their own problems:
  // (1) MoutationObserver -- have to watch the entire DOM tree
  // (2) Navigation API -- navigation event is good but it does not tell if element we are looking for exist in DOM yet.
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pageReady { from { opacity: 0.99; } to { opacity: 1; } }

    .js-navigation-container.js-active-navigation-container,
    .pull-request-tab-content {
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
};

main();
