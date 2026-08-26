import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core";

/*
 * Vitest names a browser project's nested per-browser projects by writing onto
 * the instance objects. Two projects that spread the shared browser config would
 * share those objects, and the second name would overwrite the first – so every
 * browser project gets its own copies. Without them a run filtered to one
 * project reports itself under the other project's name.
 *
 * screenshotFailures is off for both browser projects. A failure would drop a
 * PNG next to the test, and neither __screenshots__ directory is gitignored, so
 * `git add` picks the stray file up. It adds nothing either: a visual mismatch
 * already writes reference, actual and diff to the gitignored
 * .vitest-attachments, and the DOM assertions have no pixels worth capturing.
 */
const browserTestConfig = () => ({
  ...vitestBrowserTestConfig,
  browser: {
    ...vitestBrowserTestConfig.browser,
    instances: (vitestBrowserTestConfig.browser?.instances ?? []).map(
      (instance) => ({ ...instance }),
    ),
    screenshotFailures: false,
  },
});

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
            ...browserTestConfig(),
            name: "browser",
            include: ["src/**/*.browser.test.{ts,tsx}"],
            exclude: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            setupFiles: "./dev/vitest/setupBrowser.ts",
          },
        },
        {
          extends: true,
          test: {
            ...browserTestConfig(),
            name: "visual",
            include: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            // setupVisualTheme renders one of the two browsers in dark theme.
            setupFiles: [
              "./dev/vitest/setupBrowser.ts",
              "./dev/vitest/setupVisualTheme.ts",
            ],
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
