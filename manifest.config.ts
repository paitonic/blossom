import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest((env) => {
  const isDev = env.mode === "development";

  // for local development with mock HTML pages
  const fileAccessPermissions = isDev ? ["file:///*"] : [];

  return {
    manifest_version: 3,
    name: pkg.name,
    description: "Turn GitHub Pull Requests into a personal work journal. Track tasks, see your stats, and reflect.",
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
    web_accessible_resources: [
      {
        resources: ["blossom-128x128.png"],
        matches: ["https://github.com/*"],
      },
    ],
    permissions: ["storage"],
    optional_permissions: ["downloads"]
  };
});
