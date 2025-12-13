import { mount } from "svelte";
import App from "./views/App.svelte";
import RateButton from "./views/RateButton.svelte";

console.log("[CRXJS] Hello world from content script!");

function mountApp() {
  // const container = document.createElement("div");
  // container.id = "blossom-extension";
  // document.body.appendChild(container);
  // mount(App, {
  //   target: container,
  // });

  console.log("find elements");
  const links = document.querySelectorAll('a[id*="issue_"][id*="_link"]');
  for (const element of links) {
    const id = element.id.split("_")[1];
    const title = element.innerText;
    // console.log(`issue ${id} ${title}`);
    const openedBy = element.parentNode.querySelector(".opened-by");
    const parentOfOpenedBy = openedBy?.parentNode;

    const target = document.createElement("span");
    parentOfOpenedBy?.appendChild(target);
    mount(RateButton, { target: target });
  }
}

mountApp();
