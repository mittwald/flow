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
