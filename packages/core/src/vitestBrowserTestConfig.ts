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

/*
 * Selects an element's text by dragging the mouse across it, and resolves once
 * the whole text is selected. Only a native drag selects text at all — synthetic
 * events never do, and the browser extends the selection from the intermediate
 * moves.
 *
 * Parallel test files share one page and therefore one mouse cursor, so another
 * file's click can release the button mid-drag and cut the selection short. The
 * moves go out as a single `steps` call, which no other action can interleave,
 * and the drag is repeated until the selection covers the text.
 *
 * `overshoot` starts and ends the drag that many pixels outside the element, to
 * cover aiming beside the text. The selection still has to come out as the
 * element's text: the browser clamps it to the ends of the line.
 */
const selectTextByDragging: BrowserCommand<
  [selector: string, overshoot?: number]
> = async ({ page, frame, iframe }, selector, overshoot = 0) => {
  const locator = iframe.locator(selector).first();
  const box = await locator.boundingBox();
  const text = (await locator.textContent())?.trim();

  if (!box || !text) {
    throw new Error(`No visible element with text matches "${selector}"`);
  }

  const selectedText = async () =>
    (await (await frame()).evaluate(() => String(getSelection()))).trim();

  const y = box.y + box.height / 2;

  for (let attempt = 1; attempt <= 5; attempt++) {
    await page.mouse.move(box.x + 1 - overshoot, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 1 + overshoot, y, { steps: 12 });
    await page.mouse.up();

    for (let poll = 1; poll <= 10; poll++) {
      if ((await selectedText()) === text) {
        return;
      }
      await page.waitForTimeout(50);
    }
  }

  throw new Error(
    `Dragging across "${selector}" selected "${await selectedText()}" instead of "${text}"`,
  );
};

/*
 * Drags the mouse between two points given in the test frame's own coordinates,
 * with no expectation about what the drag does.
 */
const dragMouse: BrowserCommand<
  [from: { x: number; y: number }, to: { x: number; y: number }]
> = async ({ page, iframe }, from, to) => {
  const frame = await iframe.owner().boundingBox();

  if (!frame) {
    throw new Error("The test frame has no layout box");
  }

  await page.mouse.move(frame.x + from.x, frame.y + from.y);
  await page.mouse.down();
  await page.mouse.move(frame.x + to.x, frame.y + to.y, { steps: 12 });
  await page.mouse.up();
};

export const vitestBrowserTestConfig: ProjectConfig = {
  css: {
    include: /.+/,
  },
  browser: {
    enabled: true,
    commands: {
      setReducedMotion,
      selectTextByDragging,
      dragMouse,
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
