import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { createVitestBrowserTestConfig } from "../core/src/index.ts";
import defaultConfig from "./vite.config.ts";

/* A fresh call per browser project: the factory hands out its own
 * `browser.instances` objects, which vitest names by writing onto them. */
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
