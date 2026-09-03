import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { vitestBrowserTestConfig } from "../core";
import { serveFontsLocally } from "./dev/vitest/serveFontsLocally";

/*
 * Vitest names a browser project's nested per-browser projects by writing onto
 * the instance objects. Two projects that spread the shared browser config would
 * share those objects, and the second name would overwrite the first – so every
 * browser project gets its own copies. Without them a run filtered to one
 * project reports itself under the other project's name.
 *
 * screenshotFailures is off for both browser projects. A failure would drop a
 * PNG next to the test, and neither __screenshots__ directory is gitignored, so
 * `git add` picks the stray file up. It adds nothing either: a visual mismatch
 * already writes reference, actual and diff to the gitignored
 * .vitest-attachments, and the DOM assertions have no pixels worth capturing.
 */
const browserTestConfig = () => ({
  ...vitestBrowserTestConfig,
  browser: {
    ...vitestBrowserTestConfig.browser,
    commands: {
      ...vitestBrowserTestConfig.browser?.commands,
      serveFontsLocally,
    },
    instances: (vitestBrowserTestConfig.browser?.instances ?? []).map(
      (instance) => ({ ...instance }),
    ),
    screenshotFailures: false,
  },
});

/** Held in one place so the `browser` override below reuses its instance copies. */
const visualTestConfig = browserTestConfig();

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
            include: ["src/**/*.browser.test.{ts,tsx}"],
            exclude: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            setupFiles: "./dev/vitest/setupBrowser.ts",
          },
        },
        {
          extends: true,
          test: {
            ...visualTestConfig,
            browser: {
              ...visualTestConfig.browser,
              /*
               * Vitest turns its browser UI on for every non-headless run
               * (`browser.ui ??= headless === true ? false : !isCI`), and the
               * UI runs the tests in an iframe it scales down to fit its panel.
               * An element screenshot comes back scaled with it — 528x298
               * instead of the container's 1280x720 — so `test:visual:dev`, or
               * any run without `--browser.headless`, failed every scenario on
               * the dimensions alone.
               *
               * Headed is still not pixel-identical to the headless baselines
               * (a stray ~28px of antialiasing on small icons), but it is
               * comparable, which the UI's scaled frame never was.
               */
              ui: false,
            },
            name: "visual",
            include: ["src/tests/visual/**/*.browser.test.{ts,tsx}"],
            /*
             * One tester iframe for the whole run. Vitest's default gives every
             * test file a fresh iframe and removes the previous one, and
             * Playwright's WebKit never releases a removed iframe's document:
             * a forced GC afterwards keeps every one of them alive (Chromium and
             * Firefox collect them), and navigating the iframe to `about:blank`
             * before removing it changes nothing. Each finished file therefore
             * left its whole realm behind — component library, all.css, fonts,
             * last render — about 200 MB per file in this suite, until the
             * unsharded `update-screenshots` run died at file 105 of 168
             * (#3119). Reproduced outside vitest with a bare page that adds and
             * removes a heavy same-origin iframe.
             *
             * Without the churn nothing accumulates, and the run also skips the
             * per-file import of the library: locally 122 s instead of 289 s for
             * both browsers. The price is shared module state across files.
             * Mounted trees are not part of it — `render` calls `cleanup()`
             * first — and the setup files only set the theme and load fonts,
             * which are meant to persist anyway.
             */
            isolate: false,
            /*
             * One page at a time, because a screenshot depends on the page
             * holding the document focus. Firefox drops `:focus`/`:focus-within`
             * as soon as `document.hasFocus()` goes false, and with one browser
             * context per test file only one of them can hold it — measured 841
             * of 1014 screenshots without it, which greyed out every focused
             * field and failed 25 to 31 of the 354 tests, a different set each
             * run. Serial, the same suite is 353/354. Webkit keeps the state and
             * never showed the difference.
             *
             * This is also the only mode the baselines exist for: they are
             * written by `test:visual:update`, and CI has always passed
             * `--browser.fileParallelism=false`. Setting it here instead of on
             * the command line is what makes a plain `nx test:visual` agree with
             * them.
             */
            fileParallelism: false,
            /*
             * Vitest's browser default is 15s, which leaves no room for
             * `waitForPaintedContent`'s 20s budget: the test would time out
             * with a generic message before that budget can report a genuinely
             * blank scenario. A visual test also renders, interacts and takes
             * several screenshots, and the slowest here needs 12s in CI.
             */
            testTimeout: 60_000,
            // setupVisualTheme renders one of the two browsers in dark theme.
            setupFiles: [
              "./dev/vitest/setupBrowser.ts",
              "./dev/vitest/setupVisualTheme.ts",
            ],
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
            include: ["dev/**/*.test.{ts,tsx}", "e2e/**/*.test.{ts,tsx}"],
            exclude: ["**/*.browser.test.{ts,tsx}"],
            environment: "node",
          },
        },
      ],
    },
  }),
);
