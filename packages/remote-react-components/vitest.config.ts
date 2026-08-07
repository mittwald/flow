import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/vitestBrowserTestConfig";

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
            ...vitestBrowserTestConfig,
            name: "browser",
            include: ["src/**/*.browser.test.{ts,tsx}"],
            exclude: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            setupFiles: "./dev/vitest/setupBrowser.ts",
          },
        },
        {
          extends: true,
          test: {
            ...vitestBrowserTestConfig,
            name: "visual",
            include: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            setupFiles: "./dev/vitest/setupBrowser.ts",
            browser: {
              ...vitestBrowserTestConfig.browser,
              // Failure screenshots land in src/tests/visual/__screenshots__ —
              // the tracked baseline directory — and are not gitignored, so a
              // local failure leaves stray PNGs that `git add` picks up. They
              // add nothing either: a mismatch already writes reference, actual
              // and diff to the gitignored .vitest-attachments.
              screenshotFailures: false,
            },
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
            include: ["dev/**/*.test.{ts,tsx}", "e2e/**/*.test.{ts,tsx}"],
            exclude: ["**/*.browser.test.{ts,tsx}"],
            environment: "node",
          },
        },
      ],
    },
  }),
);
