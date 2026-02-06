import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config";
import { name, version } from "./package.json";

export default defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
      "@public": `${path.resolve(__dirname, "public")}`,
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: true,
      },
    }),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: `${name}-${version}.zip` }),
  ],
  build: {
    rollupOptions: {
      input: {
        dashboard: path.resolve(__dirname, "src/dashboard/index.html"),
      },
    },
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
