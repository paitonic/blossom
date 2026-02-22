const VERSION = 2
const ORG = "superheroes";
const PROJECTS = [
  "Batman",
  "Superman",
  "IronMan",
  "CaptainAmerica",
  "Thor",
  "Hulk",
  "BlackWidow",
  "Spiderman",
  "WonderWoman",
  "Flash",
];
const TAGS = [
  "cache",
  "redis",
  "api",
  "ui",
  "database",
  "auth",
  "testing",
  "performance",
  "security",
  "a11y",
  "i18n",
  "docs",
  "deps",
  "config",
  "ci",
  "mobile",
  "analytics",
  "logging",
  "payment",
  "search",
  "ai",
  "shield",
  "protocol",
];
const CHALLENGES = ["easy", "medium", "hard"];
const IMPACTS = ["low", "medium", "high"];
const SENTIMENTS = [1, 0, -1];
const EFFORTS = ["xs", "s", "m", "l", "xl"];
const TYPES = ["feature", "chore", "bug", "research"];
const TITLES = [
  "Fix batmobile engine",
  "Update kryptonite shield",
  "Refactor web shooters",
  "Optimize JARVIS protocol",
  "Add vibranium support",
  "Fix cape physics",
  "Upgrade repulsor beams",
  "Patch multiverse leak",
  "Improve spider-sense latency",
  "Add fortress of solitude auth",
  "Debug bifrost connection",
  "Refactor super-soldier serum",
  "Update daily bugle scraper",
  "Fix invisible jet rendering",
  "Optimize speed force calculations",
  "Add lasso of truth validation",
  "Update mjolnir permissions",
  "Fix hulk smash gesture",
  "Add stark tower firewall",
  "Implement justice league sync",
  "Implement advanced holographic training simulation for new recruits in the Danger Room",
  "Optimize the global satellite surveillance system to track interdimensional anomalies",
  "Refactor the Arc Reactor's power distribution logic to prevent containment breaches",
  "Update the Bat-Computer's facial recognition algorithms to improve vigilante tracking",
  "Implement a secure quantum-encrypted communication channel for the Justice League team",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateData() {
  const data = {};
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2026-01-23");
  const TOTAL_ITEMS = 1_000;
  const INCOMPLETE_ITEMS = 25; // At least 20

  for (let i = 1; i <= TOTAL_ITEMS; i++) {
    const project = randomItem(PROJECTS);
    const prId = 1000 + i;
    const key = `${ORG}/${project}/${prId}`;
    const isIncomplete = i <= INCOMPLETE_ITEMS;

    let entry = {
      openedAt: randomDate(startDate, endDate).toISOString(),
      pullRequestID: prId.toString(),
      repository: project,
      title: randomItem(TITLES),
      type: randomItem(TYPES),
      user: ORG,
    };

    const hasTicket = Math.random() < 0.5;
    if (hasTicket) {
      entry.ticket = Math.random() < 0.5
        ? `PROJ-${Math.floor(Math.random() * 1000)}`
        : `https://jira.com/browse/PROJ-${Math.floor(Math.random() * 1000)}`;
    }

    if (isIncomplete) {
      // Incomplete items requirements:
      // - notes field is empty
      // - tags field is an empty array
      // - challenge field is missing
      // - impact field is missing
      // - sentiment field is missing
      // - effort field is missing
      entry.notes = "";
      entry.tags = [];
      // Other fields are omitted
    } else {
      // Complete items
      const numTags = Math.floor(Math.random() * 3) + 1;
      const prTags = [];
      for (let j = 0; j < numTags; j++) {
        const tag = randomItem(TAGS);
        if (!prTags.includes(tag)) prTags.push(tag);
      }
      const hasNotes = Math.random() < 0.1;

      entry.challenge = randomItem(CHALLENGES);
      entry.impact = randomItem(IMPACTS);
      entry.notes = hasNotes
        ? "Some interesting observations about this mission."
        : "";
      entry.sentiment = randomItem(SENTIMENTS);
      entry.effort = randomItem(EFFORTS);
      entry.tags = prTags;
    }

    data[key] = entry;
  }

  data["blossom:settings"] = {
    version: VERSION,
  };

  // Return flat data for easy import/usage in the new format context
  // or keep it wrapped if that's the preferred backup format.
  // The previous file returned a wrapped object. I'll stick to that but with new data.
  return {
    createdAt: new Date().toISOString(),
    data: data,
  };
}

const fakeData = generateData();
console.log(JSON.stringify(fakeData, null, 2));
