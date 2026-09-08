import defaultConfig from "./vite.config.ts";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/index.ts";
import { flowComponentsLayerPlugin } from "./dev/vite/flowComponentsLayerPlugin.ts";

/*
 * Vitest names a browser project's nested per-browser projects by writing onto
 * the instance objects. Two projects that spread the shared browser config would
 * share those objects, and the second name would overwrite the first – so every
 * browser project gets its own copies.
 */
const browserTestConfig = () => ({
  ...vitestBrowserTestConfig,
  browser: {
    ...vitestBrowserTestConfig.browser,
    instances: (vitestBrowserTestConfig.browser?.instances ?? []).map(
      (instance) => ({ ...instance }),
    ),
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
            setupFiles: "./dev/vitest/setupBrowser.ts",
            include: ["src/**/*.browser.test.{ts,tsx}"],
            exclude: ["src/tests/layered/**"],
          },
        },
        {
          /*
           * The same components against the opt-in layered stylesheet variant,
           * where Flow's CSS loses to the unlayered CSS dependencies inject at
           * runtime. Its own project because the variant is a property of the
           * whole document, and it needs the release build's layer plugin so
           * that the module styles compiled for these tests are layered the way
           * the release is.
           */
          extends: true,
          css: {
            postcss: { plugins: [flowComponentsLayerPlugin()] },
          },
          test: {
            ...browserTestConfig(),
            name: "browser-layered",
            setupFiles: "./dev/vitest/setupBrowserLayered.ts",
            include: ["src/tests/layered/**/*.browser.test.{ts,tsx}"],
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
