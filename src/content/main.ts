import { mount } from "svelte";
import BlossomButton from "./views/BlossomButton.svelte";
import Popover from "./views/Popover.svelte";

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

    let target = element.parentNode?.querySelector(".blossom-extension");
    if (target) {
      throw new Error("blossom: extension is already mounted!");
    } else {
      target = document.createElement("span");
      target.className = "blossom-extension-button";
      target.style.display = "inline-flex";
      target.style.marginLeft = "4px";
      openedBy.appendChild(target);
    }

    mount(BlossomButton, {
      target,
      props: {
        pullRequestURL: element.href,
        title,
        openedAt,
      },
    });
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
    const link = datetimeElement?.parentNode.href;
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
        pullRequestURL: link,
        title,
        openedAt,
      },
    });
  }

  mountPopover();
};

const main = () => {
  mountExtension();

  // When page navigation happens, GitHub replaces wntire <div> with all the content under <body>.
  // This observes node changed on the <body> tag.
  // When change is detected by the observer then the extension will mount.
  // <body>
  //    <div class="logged-in env-production page-responsive">
  //    ...
  // </body>
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        console.log("node: ", node);
        if (node.className === "logged-in env-production page-responsive") {
          // the "div" under <body> has been replaced with new content
          mountExtension();
          return;
        }
      }
    }
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
  });
};

main();
