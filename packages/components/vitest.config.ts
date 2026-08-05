import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core/src/vitestBrowserTestConfig";
import { flowComponentsLayerPlugin } from "./dev/vite/flowComponentsLayerPlugin";

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
           * whole document, and it needs the release build's layer plugin
           * instead of the dev config's marker plugin.
           *
           * Spread instead of `extends: true`, because extending concatenates
           * `css.postcss.plugins` with the dev config's – the marker plugin
           * would then strip the markers before the layer plugin can segment at
           * them, and every rule would end up layered.
           */
          ...defaultConfig,
          css: {
            ...defaultConfig.css,
            postcss: { plugins: [flowComponentsLayerPlugin()] },
          },
          test: {
            ...vitestBrowserTestConfig,
            globals: true,
            globalSetup: "./dev/vitest/setupGlobal.ts",
            name: "layered",
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
