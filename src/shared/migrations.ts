import { storage } from "./storage.svelte.js";

export const DATA_FORMAT_VERSION = "1.0";

/**
 * Migration functions indexed by the version they migrate TO.
 * Example: "1.1": (data) => { ... return migratedData; }
 */
const MIGRATIONS: Record<string, (data: any) => any> = {
  // Future migrations will be added here
};

/**
 * Ordered list of versions to ensure migrations are applied in the correct sequence.
 */
const VERSION_ORDER = ["1.0"];

export async function migrate() {
  const settings = await storage.kget("blossom:settings");

  if (!settings || !settings.version) {
    const initialSettings = {
      ...(settings || {}),
      version: "1.0",
    };
    await storage.kset("blossom:settings", initialSettings);

    // If we just initialized to 1.0, and that's not the latest, we proceed to migrate
    if (DATA_FORMAT_VERSION !== "1.0") {
      await runMigrationSequence("1.0");
    }
    return;
  }

  if (settings.version !== DATA_FORMAT_VERSION) {
    await runMigrationSequence(settings.version);
  }
}

async function runMigrationSequence(currentVersion: string) {
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
