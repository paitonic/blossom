import { mount } from "svelte";
import App from "./views/App.svelte";
import RateButton from "./views/RateButton.svelte";
import Popover from "./views/Popover.svelte";

console.log("[CRXJS] Hello world from content script!");

const mountPopover = () => {
  const body = document.querySelector("body");
  const container = document.createElement("div");
  body?.appendChild(container);
  mount(Popover, { target: container });
};

function mountApp() {
  // const container = document.createElement("div");
  // container.id = "blossom-extension";
  // document.body.appendChild(container);
  // mount(App, {
  //   target: container,
  // });

  const links = document.querySelectorAll('a[id*="issue_"][id*="_link"]');
  for (const element of links) {
    const id = element.id.split("_")[1];
    const title = element.innerText;
    // console.log(`issue ${id} ${title}`);
    const openedBy = element.parentNode.querySelector(".opened-by");
    const parentOfOpenedBy = openedBy?.parentNode;

    const container = document.createElement("span");
    parentOfOpenedBy?.appendChild(container);
    mount(RateButton, { target: container });
  }

  mountPopover();
}

mountApp();
