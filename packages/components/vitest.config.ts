import defaultConfig from "./vite.config.ts";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { createVitestBrowserTestConfig } from "../core/src/index.ts";
import { flowComponentsLayerPlugin } from "./dev/vite/flowComponentsLayerPlugin.ts";
import { unlayeredStylesPlugin } from "./dev/vite/unlayeredStylesPlugin.ts";

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
          /*
           * The default, unlayered stylesheet variant. Both variants are
           * compiled from `src/styles/index.scss`, which declares Flow's
           * layers; this project flattens them, the way the release build
           * derives `all.css` from `all-layered.css`.
           */
          extends: true,
          css: {
            postcss: { plugins: [unlayeredStylesPlugin()] },
          },
          test: {
            ...createVitestBrowserTestConfig(),
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
            ...createVitestBrowserTestConfig(),
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
