import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
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
