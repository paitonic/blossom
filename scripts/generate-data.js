const ORG = "skynet";
const PROJECTS = [
  "Apollo",
  "Zeus",
  "Hermes",
  "Athena",
  "Ares",
  "Poseidon",
  "Hades",
  "Hera",
  "Demeter",
  "Dionysus",
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
];
const CHALLENGES = ["high", "medium", "low"];
const IMPACTS = ["high", "medium", "low"];
const REACTIONS = ["positive", "neutral", "negative"];
const SIZES = ["small", "medium", "large"];
const TYPES = ["feature", "chore", "bug", "hotfix"];
const TITLES = [
  "Improve API performance",
  "Fix login bug",
  "Update documentation",
  "Refactor user component",
  "Add dark mode",
  "Optimize database queries",
  "Upgrade dependencies",
  "Fix memory leak",
  "Add unit tests",
  "Implement payment gateway",
  "Update CI pipeline",
  "Fix CSS layout",
  "Add search functionality",
  "Improve accessibility",
  "Add analytics events",
  "Fix typo in README",
  "Remove unused code",
  "Update logo",
  "Fix header alignment",
  "Add error handling",
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
  const TOTAL_ITEMS = 150;
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

    if (isIncomplete) {
      // Incomplete items requirements:
      // - notes field is empty
      // - tags field is an empty array
      // - challenge field is missing
      // - impact field is missing
      // - reaction field is missing
      // - size field is missing
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
        ? "Some interesting observations about this PR."
        : "";
      entry.reaction = randomItem(REACTIONS);
      entry.size = randomItem(SIZES);
      entry.tags = prTags;
    }

    data[key] = entry;
  }

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    data: data,
  };
}

const fakeData = generateData();
console.log(JSON.stringify(fakeData, null, 2));
