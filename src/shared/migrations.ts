import { storage } from "./storage.svelte.js";

export const DATA_FORMAT_VERSION = 3;

/**
 * Migration functions indexed by the version they migrate TO.
 * Example: 2: (data) => { ... return migratedData; }
 */
const MIGRATIONS: Record<number, (data: any) => any> = {
  2: (data) => {
    for (const key in data) {
      if (key !== "blossom:settings" && !data[key].ticket) {
        data[key].ticket = "";
      }
    }
    return data;
  },
  3: (data) => {
    for (const key in data) {
      if (key !== "blossom:settings" && typeof data[key].author !== "string") {
        data[key].author = "";
      }
    }
    return data;
  },
};

/**
 * Ordered list of versions to ensure migrations are applied in the correct sequence.
 */
const VERSION_ORDER = [1, 2, 3];

export async function migrate() {
  const settings = await storage.kget("blossom:settings");

  // Handle legacy string versions or missing version
  let currentVersion = settings?.version;
  if (typeof currentVersion === "string") {
    // Treat "1.0" and "1.1" as version 1
    currentVersion = 1;
    // Update version in settings to numeric immediately
    await storage.kset("blossom:settings", { ...settings, version: 1 });
  }

  if (!currentVersion) {
    const initialSettings = {
      ...(settings || {}),
      version: 1,
    };
    await storage.kset("blossom:settings", initialSettings);

    // If we just initialized to 1, and that's not the latest, we proceed to migrate
    if (DATA_FORMAT_VERSION !== 1) {
      await runMigrationSequence(1);
    }
    return;
  }

  if (currentVersion !== DATA_FORMAT_VERSION) {
    await runMigrationSequence(currentVersion);
  }
}

async function runMigrationSequence(currentVersion: number) {
  const startIndex = VERSION_ORDER.indexOf(currentVersion);
  const targetIndex = VERSION_ORDER.indexOf(DATA_FORMAT_VERSION);

  if (startIndex === -1 || targetIndex === -1 || startIndex >= targetIndex) {
    // Current version not found in order, or already at/ahead of target
    return;
  }

  let allData = await storage.kall();
  // Settings should not be passed to migration functions to avoid confusion
  delete allData["blossom:settings"];

  let migratedData = allData;

  for (let i = startIndex + 1; i <= targetIndex; i++) {
    const nextVersion = VERSION_ORDER[i];
    const migrationFn = MIGRATIONS[nextVersion];
    if (migrationFn) {
      migratedData = await migrationFn(migratedData);
    }
  }

  // Update data in storage
  await storage.kset(migratedData);

  // Update version in settings
  const settings = await storage.kget("blossom:settings", {});
  settings.version = DATA_FORMAT_VERSION;
  await storage.kset("blossom:settings", settings);
}
