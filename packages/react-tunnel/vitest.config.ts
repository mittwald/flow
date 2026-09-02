import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/";

export default mergeConfig(
  defaultConfig,
  defineConfig({
    // The SSR hydration test imports these directly; pre-bundle them so Vite
    // doesn't discover them mid-run and reload the test (which flakes the suite).
    optimizeDeps: {
      include: ["react-dom/server", "react-dom/client"],
    },
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
