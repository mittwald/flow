import { playwright } from "@vitest/browser-playwright";
import type { ProjectConfig } from "vitest/node";
import type { BrowserCommand } from "vitest/node";

const viewport = { width: 1280, height: 720 };

const setReducedMotion: BrowserCommand<
  [value: "reduce" | "no-preference"]
> = async ({ page }, value) => {
  await page.emulateMedia({
    reducedMotion: value,
  });
};

export const vitestBrowserTestConfig: ProjectConfig = {
  css: {
    include: /.+/,
  },
  browser: {
    enabled: true,
    commands: {
      setReducedMotion,
    },
    /*
     * A failure screenshot defaults to `<test dir>/__screenshots__`, which is
     * where the committed visual baselines live and is gitignored nowhere, so
     * the stray PNG lands in the next commit. Redirect it. The path resolves
     * against the process cwd, so `.gitignore` carries a bare
     * `.vitest-screenshots` that matches at any depth.
     */
    screenshotDirectory: ".vitest-screenshots",
    expect: {
      toMatchScreenshot: {
        /*
         * `screenshotDirectory` also feeds the baseline path, but there it is a
         * segment inside the test directory. Without this pin to vitest's
         * default shape the committed baselines move into the gitignored
         * directory and the visual suite silently re-baselines itself.
         */
        resolveScreenshotPath: ({
          root,
          testFileDirectory,
          testFileName,
          arg,
          browserName,
          platform,
          ext,
        }) =>
          `${root}/${testFileDirectory}/__screenshots__/${testFileName}/${arg}-${browserName}-${platform}${ext}`,
      },
    },
    provider: playwright({
      /*
       * Bounds a stuck action, not a slow one. One browser context per test
       * file runs in parallel, and on a loaded machine a legitimate click goes
       * past 5s — seen as `locator.click: Timeout 5000ms exceeded` on a
       * scenario that passes on its own. Stays below the 15s browser default
       * of `testTimeout`, so the action's own message still reaches the report.
       */
      actionTimeout: 10_000,
      contextOptions: {
        reducedMotion: "reduce",
        locale: "en-US",
      },
    }),
    instances: [
      {
        browser: "firefox",
        viewport,
      },
      {
        browser: "webkit",
        viewport,
      },
      /**
       * Exclude Chromium for visual tests for now due to flakiness in CI
       * execution:
       *
       * Error: Failed to import test file
       * /home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx
       *
       * Caused by: TypeError: Failed to fetch dynamically imported module:
       * http://localhost:63315/home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx?import&browserv=1765973079806
       *
       *       {
       *         browser: "chromium",
       *         viewport,
       *       },
       */
    ],
  },
};
