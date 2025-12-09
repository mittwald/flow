import { playwright } from "@vitest/browser-playwright";
import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import type { ProjectConfig } from "vitest/node";

const browserTest: ProjectConfig = {
  fileParallelism: false,
  setupFiles: "./dev/vitest/setupBrowser.ts",
  css: {
    include: /.+/,
  },
  browser: {
    enabled: true,
    provider: playwright({
      actionTimeout: 5000,
      contextOptions: {
        reducedMotion: "reduce",
      },
    }),
    instances: [
      {
        browser: "chromium",
        viewport: { width: 1280, height: 720 },
      },
      {
        browser: "firefox",
        viewport: { width: 1280, height: 720 },
      },
      {
        browser: "webkit",
        viewport: { width: 1280, height: 720 },
      },
    ],
  },
};

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
      globalSetup: "./dev/vitest/setupGlobal.ts",
      coverage: {
        reporter: ["json-summary", "json"],
        reportOnFailure: true,
      },

      projects: [
        {
          extends: true,
          test: {
            name: "browser",
            ...browserTest,
            include: ["src/**/*.browser.test.{ts,tsx}"],
            exclude: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
          },
        },
        {
          extends: true,
          test: {
            name: "visual",
            ...browserTest,
            include: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
          },
        },
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/*.test.{ts,tsx}"],
            exclude: ["src/**/*.browser.test.{ts,tsx}"],
          },
        },
        {
          extends: true,
          test: {
            name: "unit-dev",
            include: ["dev/**/*.test.{ts,tsx}"],
            environment: "node",
          },
        },
      ],
    },
  }),
);
