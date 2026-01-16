import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest((env) => {
  const isDev = env.mode === "development";

  // for local development with mock HTML pages
  const fileAccessPermissions = isDev ? ["file:///*"] : [];

  return {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
      48: "blossom-48x48.png",
    },
    action: {
      default_icon: {
        48: "blossom-48x48.png",
      },
    },
    background: {
      service_worker: "src/background/index.ts",
      type: "module",
    },
    content_scripts: [
      {
        js: ["src/content/main.ts"],
        matches: ["https://github.com/*", ...fileAccessPermissions],
      },
    ],
    permissions: ["contentSettings", "storage", "downloads"],
    side_panel: {
      default_path: "src/sidepanel/index.html",
    },
  };
});
