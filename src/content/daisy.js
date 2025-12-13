const getExtensionIcon = () => {
  const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <!-- Petals -->
    <g fill="#F2F2F7" stroke="#C8C8CF" stroke-width="0.6" stroke-linejoin="round">
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(0 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(45 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(90 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(135 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(180 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(225 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(270 8 8)"/>
      <ellipse cx="8" cy="3" rx="1.6" ry="3.2" transform="rotate(315 8 8)"/>
    </g>

    <!-- Center -->
    <circle cx="8" cy="8" r="3.2" fill="#FFCC33" stroke="#D8A12A" stroke-width="0.6"/>
  </svg>
  `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(logo, "image/svg+xml");
  const svg = doc.documentElement;

  return svg;
};

const isPullRequestPage = () => {
  // 'https://github.com/github/docs/pull/41748'
  return window.location.href.includes("/pull/");
};

const isPullRequestListPage = () => {
  // 'https://github.com/github/docs/pulls?q=is%3Apr+is%3Aclosed'
  return window.location.href.includes("pulls");
};

const extractPullRequestID = () => {};

const injectDaisy = () => {
  // const rows = document.querySelectorAll('div[aria-label="Issues"] .js-issue-row');

  // "#41716 opened 17 hours ago by user" -- TEXT
  // rows = document.querySelectorAll('div[aria-label="Issues"] .js-issue-row .opened-by')

  for (const openedByElement of document.querySelectorAll(
    'div[aria-label="Issues"] .js-issue-row .opened-by',
  )) {
    const icon = getExtensionIcon();
    const span = document.createElement("span");
    const separator = document.createTextNode(" • ");
    span.appendChild(separator);
    span.appendChild(icon);

    const text = document.createElement("span");
    text.innerText = "Rate";
    span.appendChild(text);

    openedByElement.parentNode.appendChild(span);
  }
};

// injectDaisy();

// PR List <a> tag (title)

const extractProjectName = () => {
  // window.location.href = https://github.com/{COMPANY}/{PROJECT}/pulls
  const parts = window.location.href.split("/");
  return parts[3] + "/" + parts[4];
};

// popover
content = document.querySelector("body .logged-in");
div = document.createElement("div");
div.innerHTML = `
  <div popover id="daisy-popover">
    <h3 id="daisy-popover-pr"></h3>
    <form id="popForm" autocomplete="off">
        <!-- Type -->
        <div>
            <label for="daisyPopupTypeSelect">Type</label>
            <select id="daisyPopupTypeSelect" name="type" required="">
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="chore">Chore</option>
            </select>
        </div>

        <!-- Impact -->
        <div class="impactWrap">
            <label for="daisyPopupImpact">Impact</label>
            <input type="range" id="daisyPopupImpact" name="impact" min="1" max="3" value="2" step="1">
        </div>

        <!-- Tags -->
        <div>
            <label for="daisyPopupTags">Tags
            <div class="row">
                <input id="daisyPopupTags" type="text" placeholder="add a tag" aria-describedby="tagsHint">
            </div>
            <div class="tags" id="tagsContainer" aria-live="polite"></div>
        </div>

        <!-- Notes -->
        <div>
            <label for="daisyPopupNotes">Notes</label>
            <textarea id="daisyPopupNotes" name="notes" placeholder="Short note..." maxlength="500"></textarea>
        </div>

        <!-- buttons -->
        <div class="">
            <button type="button" class="" id="daisyPopupCancelBtn">
                Cancel
            </button>
            <button type="submit" class="" id="daisyPopupSaveBtn">
                Save
            </button>
        </div>
    </form>
  </div>
`;
content.appendChild(div);

popover = document.querySelector("#daisy-popover");
// popover.showPopover();

// end of popover

const loadFromDisk = () => {
  data = localStorage.getItem("daisy");
  if (data) {
    return JSON.parse(data);
  } else {
    return {};
  }
};

const saveOnDisk = (record) => {
  console.log(`saving `, record);
  data = loadFromDisk("daisy");

  if (data[record.projectName]) {
    data[record.projectName][record.pullRequestID] = record;
  } else {
    data[record.projectName] = {};
    data[record.projectName][record.pullRequestID] = record;
  }

  localStorage.setItem("daisy", JSON.stringify(data));
};

const loadRecord = (projectName, pullRequestID) => {
  data = loadFromDisk();
  if (data?.[projectName]?.[pullRequestID]) {
    return data[projectName][pullRequestID];
  } else {
    return null;
  }
};

const openDaisy = (event, projectName, pullRequestID) => {
  console.log(`opening daisy for ${pullRequestID}`);

  popover.showPopover();
  title = popover.querySelector("#daisy-popover-pr");
  title.innerText = `PR: #${pullRequestID}`;
  cancelBtn = popover.querySelector("#daisyPopupCancelBtn");
  saveBtn = popover.querySelector("#daisyPopupSaveBtn");

  typeSelect = popover.querySelector("#daisyPopupTypeSelect");
  impactInput = popover.querySelector("#daisyPopupImpact");
  tags = popover.querySelector("#daisyPopupTags");
  notes = popover.querySelector("#daisyPopupNotes");

  record = loadRecord(projectName, pullRequestID);
  if (record) {
    typeSelect.value = record.type;
    impactInput.value = record.impact;
    tags.value = record.tags;
    notes.value = record.notes;
  } else {
    typeSelect.value = "";
    impactInput.value = "";
    tags.value = "";
    notes.value = "";
  }

  saveBtn.onclick = (event) => {
    event.preventDefault();
    saveOnDisk({
      projectName,
      pullRequestID,
      type: typeSelect.value,
      impact: impactInput.value,
      tags: tags.value,
      notes: notes.value,
    });
  };

  cancelBtn.onclick = (event) => {
    event.preventDefault();
    popover.hidePopover();
  };
};

const projectName = extractProjectName();

for (const linkEl of document.querySelectorAll(
  'a[id*="issue_"][id*="_link"]',
)) {
  // <a id="issue_41748_link" ...>
  const id = linkEl.id.split("_")[1];
  const title = linkEl.innerText;
  const openedByEl = linkEl.parentNode.querySelector(".opened-by");

  const container = document.createElement("span");

  const separator = document.createTextNode(" • ");
  container.appendChild(separator);

  const icon = getExtensionIcon();
  container.appendChild(icon);

  const text = document.createElement("span");
  text.innerText = "Rate";
  container.appendChild(text);

  openedByEl.parentNode.appendChild(container);
  container.onclick = (event) => {
    openDaisy(event, projectName, id);
  };
}
