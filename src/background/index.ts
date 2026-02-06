// open dashboard page when user clicks on extension icon in the toolbar
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "src/dashboard/index.html" });
});
