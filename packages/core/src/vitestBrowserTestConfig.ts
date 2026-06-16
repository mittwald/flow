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
    provider: playwright({
      actionTimeout: 5000,
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
