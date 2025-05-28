import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
      globalSetup: "./dev/vitest/setupGlobal.ts",
      setupFiles: "./dev/vitest/setupFiles.ts",
      coverage: {
        reporter: ["json-summary", "json"],
        reportOnFailure: true,
      },
    },
  }),
);
