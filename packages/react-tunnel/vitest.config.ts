import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/vitestBrowserTestConfig";

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            ...vitestBrowserTestConfig,
            name: "browser",
            include: ["src/**/*.browser.test.{ts,tsx}"],
          },
        },
      ],
    },
  }),
);
