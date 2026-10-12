import defaultConfig from "./vite.config.ts";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { createVitestBrowserTestConfig } from "../core/src/index.ts";

const browserTestConfig = createVitestBrowserTestConfig();

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
      projects: [
        {
          extends: true,
          test: {
            ...browserTestConfig,
            browser: {
              ...browserTestConfig.browser,
              screenshotFailures: false,
            },
            name: "browser",
            include: ["src/**/*.browser.test.{ts,tsx}"],
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
      ],
    },
  }),
);
