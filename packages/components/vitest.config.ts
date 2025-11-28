import { playwright } from "@vitest/browser-playwright";
import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

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
            fileParallelism: false,
            name: "browser",
            setupFiles: "./dev/vitest/setupBrowser.ts",
            include: ["src/**/*.browser.test.{ts,tsx}"],
            css: {
              include: /.+/,
            },
            browser: {
              enabled: true,
              provider: playwright({
                contextOptions: {
                  reducedMotion: "reduce",
                },
              }),
              instances: [{ browser: "chromium" }],
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
            include: ["dev/**/*.test.{ts,tsx}"],
            environment: "node",
          },
        },
      ],
    },
  }),
);
