import { readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BrowserCommand } from "vitest/node";

/**
 * The host `fonts.scss` points every `@font-face` at. Matched as a prefix, so a
 * font added there is served from here without touching this file.
 */
const remoteFonts = "https://cdn.mittwald.de/fonts/";

const localFonts = join(dirname(fileURLToPath(import.meta.url)), "fonts");

/*
 * A route is registered on the browser context, and the context outlives the
 * test file that asks for it — so remember which ones already have it instead of
 * stacking a handler per file.
 */
const routed = new WeakSet<object>();

/**
 * Serves the fonts `fonts.scss` declares out of `dev/vitest/fonts/` instead of
 * fetching them from the CDN.
 *
 * Playwright waits for `document.fonts.ready` before every screenshot
 * (`_preparePageForScreenshot`). A font request that hangs never settles that
 * promise, so _every_ capture on the page runs into `toMatchScreenshot`'s
 * stability budget and reports "Could not capture a stable screenshot within
 * 5000ms" — from the first test on, at a uniform ~5.2s per test, while setup,
 * import and rendering stay at full speed. That took down a whole shard on half
 * of all `main` runs (#3106), and the only scenarios that survived were the
 * ones rendering no text at all, because those never ask for a font:
 * `LoadingSpinner`, `CopyButton`. The same hang on the other side of the
 * timeout renders a scenario in the fallback face and reports it as a ~1%
 * diff.
 *
 * Intercepting the request rather than re-declaring the faces in CSS keeps
 * `fonts.scss` the single source of truth: two `@font-face` rules matching the
 * same family, weight and style are both candidates, and WebKit starts loading
 * both — the CDN copy stayed at `status: "loading"` next to a local one that
 * was already `loaded`, which is all `document.fonts.ready` needs to stay
 * pending.
 *
 * The files are byte-for-byte what the CDN serves, so the baselines are the
 * same pixels either way. The point is only that the suite stops reaching over
 * the network. `dev/vitest/fonts.test.ts` fails if one is missing.
 */
export const serveFontsLocally: BrowserCommand<[]> = async ({ context }) => {
  if (routed.has(context)) {
    return;
  }
  routed.add(context);

  await context.route(`${remoteFonts}*`, async (route) => {
    const file = basename(new URL(route.request().url()).pathname);
    await route.fulfill({
      body: await readFile(join(localFonts, file)),
      contentType: "font/woff2",
    });
  });
};
