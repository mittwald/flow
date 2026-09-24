import defaultConfig from "./vite.config.ts";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/index.ts";

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      globals: true,
      projects: [
        {
          extends: true,
          test: {
            ...vitestBrowserTestConfig,
            browser: {
              ...vitestBrowserTestConfig.browser,
              instances: (vitestBrowserTestConfig.browser?.instances ?? []).map(
                (instance) => ({ ...instance }),
              ),
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
