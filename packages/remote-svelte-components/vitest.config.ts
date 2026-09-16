import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/index.ts";
import defaultConfig from "./vite.config.ts";

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
            include: ["src/**/*.browser.test.ts"],
            setupFiles: "./dev/vitest/setupBrowser.ts",
          },
        },
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/*.test.ts"],
            exclude: ["src/**/*.browser.test.ts"],
          },
        },
      ],
    },
  }),
);
