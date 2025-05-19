import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { nodePolyfills as viteNodePolyfills } from "vite-plugin-node-polyfills";
import { viteI18nPlugin } from "./dev/vite/viteI18nPlugin";

export default mergeConfig(
  {
    ...defaultConfig,
    plugins: [],
  },
  defineConfig({
    plugins: [
      viteNodePolyfills({
        protocolImports: true,
        exclude: ["fs"],
      }),
      viteI18nPlugin,
    ],
    test: {
      globals: true,
      globalSetup: "./dev/vitest/setupGlobal.ts",
      setupFiles: ["@vitest/web-worker", "./dev/vitest/setupFiles.ts"],
      environmentMatchGlobs: [
        ["dev/**", "node"],
        ["src/**", "happy-dom"],
      ],
      coverage: {
        reporter: ["json-summary", "json"],
        reportOnFailure: true,
      },
    },
  }),
);
