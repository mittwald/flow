#!/usr/bin/env node
// @ts-check
/**
 * Capture a release-notes figure from real Storybook stories (#3030).
 *
 * ```shell
 * pnpm release:figure --spec <spec.json> [--storybook-url http://localhost:6007]
 * ```
 *
 * The spec names the story ids, the args that drive each variant, and what each
 * panel must render. The script stacks the panels into one PNG under
 * `apps/docs/public/assets/releases/<version>/` and prints the path plus the
 * `raw.githubusercontent.com` URL template the notes reference.
 *
 * It captures; it never invents. Every pixel comes from a story rendered out of
 * the working tree, and the script has no path that produces an image without
 * one.
 *
 * Why a script rather than a recipe in the slash command: every trap below cost
 * real time once, and each is invisible in the result — a capture that renders
 * the wrong state, or loses its bottom edge, looks entirely plausible.
 *
 * - **Playwright resolves only from the repo root.** A capture script run from a
 *   scratch directory dies with `ERR_MODULE_NOT_FOUND: Cannot find package
 *   'playwright'`. This file lives in the repo and the `pnpm` alias always runs
 *   from the root, so the resolution cannot drift.
 * - **Storybook filters `args=` to the story's declared `argTypes`** and drops
 *   the rest without a word. The story still renders — just not in the state
 *   that was asked for. Hence `expect`: every panel that drives args asserts
 *   its rendered DOM, and the spec is rejected without one.
 * - **An iframe is sized by its content's `.bottom`, never its `.height`.** The
 *   rect is relative to the iframe viewport, so `.height` omits Storybook's
 *   body `padding-top` and clips exactly that many pixels off the bottom.
 * - **Port 6006 is often held** by a Storybook from another worktree, so the
 *   script picks a free port instead of assuming one.
 * - **A hanging webfont never settles `document.fonts.ready`**, which Playwright
 *   waits on before every screenshot (#3106). The three faces `fonts.scss`
 *   declares are served from the local copies the visual suite already keeps.
 *   Playwright settles the composition page's fonts, never the story frames'
 *   own — so each panel waits for its iframe's `document.fonts.ready` before it
 *   is measured, or the figure is sized and captured in the fallback face.
 * - **`pnpm test:browser:prepare` installs only Firefox and WebKit**, so a clean
 *   checkout has no Chromium. The browser is chosen from what is actually
 *   installed, and the capture names the one it used.
 */

import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { URL, fileURLToPath } from "node:url";
import {
  buildStoryUrl,
  composeFigureHtml,
  findUnknownStories,
  normalizeFigureSpec,
  rawFigureUrl,
} from "./release-figure-lib.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** The fonts `packages/components/src/styles/fonts.scss` declares. */
const CDN_FONTS = "https://cdn.mittwald.de/fonts/";
const LOCAL_FONTS = join(
  repoRoot,
  "packages/remote-react-components/dev/vitest/fonts",
);

/** Wider than this and the figure is only ever shown scaled down. */
const COMFORTABLE_DISPLAY_WIDTH = 900;

/**
 * Browsers to try, in order. Chromium renders the figures closest to what a
 * reader sees, but `pnpm test:browser:prepare` installs only Firefox and WebKit
 * — so a clean checkout falls through to one of those rather than dying on a
 * missing executable.
 */
const BROWSERS = ["chromium", "webkit", "firefox"];

/**
 * The spec is the single source of the output path, so there is deliberately no
 * `--out` override: it would bypass the only check confining the figure to the
 * release-assets tree.
 *
 * @param {string[]} argv
 * @returns {{
 *   spec: string;
 *   storybookUrl: string | null;
 *   browser: string | null;
 * }}
 */
const parseArgs = (argv) => {
  const args = { spec: "", storybookUrl: null, browser: null };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s);
    const value = inline ?? argv[++i];
    if (flag === "--spec") args.spec = value;
    else if (flag === "--storybook-url") args.storybookUrl = value;
    else if (flag === "--browser") args.browser = value;
    else throw new Error(`unknown argument ${argv[i]}`);
  }
  if (!args.spec)
    throw new Error("--spec <path to figure spec json> is required");
  if (args.browser && !BROWSERS.includes(args.browser)) {
    throw new Error(
      `--browser must be one of ${BROWSERS.join(", ")}, got ${args.browser}`,
    );
  }
  return args;
};

/**
 * Launch the requested browser, or the first one actually installed.
 *
 * @param {import("playwright")} playwright
 * @param {string | null} requested
 * @returns {Promise<{ browser: import("playwright").Browser; name: string }>}
 */
const launchBrowser = async (playwright, requested) => {
  const candidates = requested ? [requested] : BROWSERS;
  const installed = candidates.filter((name) =>
    existsSync(playwright[name].executablePath()),
  );
  if (installed.length === 0) {
    throw new Error(
      `no Playwright browser installed for: ${candidates.join(", ")}\n` +
        `  run \`pnpm exec playwright install ${candidates[0]}\` (or \`pnpm test:browser:prepare\` for the suite's firefox + webkit)`,
    );
  }
  const name = installed[0];
  return { browser: await playwright[name].launch(), name };
};

/** @returns {Promise<number>} A port free right now */
const freePort = () =>
  new Promise((resolvePort, rejectPort) => {
    const server = createServer();
    server.on("error", rejectPort);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });

/**
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<Record<string, any>>} Storybook's `/index.json`
 */
const waitForStorybook = async (url, timeoutMs) => {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not started";
  while (Date.now() < deadline) {
    try {
      const response = await globalThis.fetch(`${url}/index.json`);
      if (response.ok) return await response.json();
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = /** @type {Error} */ (error).message;
    }
    await sleep(500);
  }
  throw new Error(`Storybook at ${url} did not come up: ${lastError}`);
};

/**
 * Start Storybook on a free port and return it plus a stop handle.
 *
 * `pnpm nx dev components` is the graph target — it builds every workspace
 * dependency first. A bare `storybook dev` would serve whatever `dist` happens
 * to hold, which for a release figure is precisely the wrong thing.
 *
 * @returns {Promise<{ url: string; stop: () => void }>}
 */
const startStorybook = async () => {
  const port = await freePort();
  const url = `http://localhost:${port}`;
  process.stderr.write(`Starting Storybook on ${url} …\n`);
  const child = spawn(
    "pnpm",
    ["nx", "dev", "components", "--", "--port", String(port), "--no-open"],
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
  );
  const log = [];
  child.stdout.on("data", (chunk) => log.push(String(chunk)));
  child.stderr.on("data", (chunk) => log.push(String(chunk)));
  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      process.stderr.write(log.join(""));
    }
  });
  try {
    await waitForStorybook(url, 300_000);
  } catch (error) {
    child.kill("SIGTERM");
    process.stderr.write(log.join(""));
    throw error;
  }
  return { url, stop: () => child.kill("SIGTERM") };
};

/**
 * Wait for one panel's story to be rendered, then report the height its content
 * needs and what it rendered.
 *
 * Runs inside the composition page, which is same-origin with the story iframes
 * — that is the only reason it can reach into `contentDocument` at all.
 */
const MEASURE_PANEL = `(async ({ index, expectations }) => {
  const frame = document.querySelector('iframe[data-panel="' + index + '"]');
  const doc = frame.contentDocument;
  const root = doc.querySelector('#storybook-root');
  if (!root || root.childElementCount === 0) return null;
  // Each iframe has its OWN font set. Playwright settles the composition page's
  // fonts before a screenshot, never the frames' — so measuring here without
  // this wait can size and capture the fallback face, which changes wrapping
  // and the bottom edge. Bounded, so a font that never arrives cannot hang the
  // capture; the outer poll re-enters.
  await Promise.race([
    doc.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
  const style = getComputedStyle(doc.body);
  const rect = root.getBoundingClientRect();
  // .bottom, not .height: the rect is relative to the iframe viewport, so
  // .height alone omits the body's padding-top and clips that many pixels.
  const height = rect.bottom + parseFloat(style.paddingBottom);
  if (!(height > 0)) return null;
  return {
    height: Math.ceil(height),
    insetLeft: style.paddingLeft,
    results: expectations.map((expectation) => {
      const matches = [...doc.querySelectorAll(expectation.selector)];
      return {
        selector: expectation.selector,
        count: matches.length,
        text: matches.map((element) => element.textContent).join(' '),
      };
    }),
  };
})`;

/**
 * Give one panel's iframe the height its content measured, and align the
 * captions with Storybook's own body inset so the figure reads as one page.
 */
const SIZE_PANEL = `(({ index, height, inset }) => {
  const frame = document.querySelector('iframe[data-panel="' + index + '"]');
  frame.style.height = height + 'px';
  document.documentElement.style.setProperty('--caption-inset', inset);
})`;

/**
 * @param {import("playwright").Page} page
 * @param {number} index
 * @param {{ selector: string; count?: number; text?: string }[]} expectations
 * @param {string} story
 */
const measurePanel = async (page, index, expectations, story) => {
  const deadline = Date.now() + 30_000;
  for (;;) {
    const measured = await page.evaluate(
      `${MEASURE_PANEL}(${JSON.stringify({ index, expectations })})`,
    );
    if (measured) return measured;
    if (Date.now() > deadline) {
      throw new Error(
        `panel ${index} (${story}) rendered nothing into #storybook-root within 30s — open the story in Storybook and check its console`,
      );
    }
    await sleep(250);
  }
};

/**
 * @param {{
 *   story: string;
 *   expect: { selector: string; count?: number; text?: string }[];
 * }} panel
 * @param {number} index
 * @param {{ selector: string; count: number; text: string }[]} results
 * @returns {string[]} One message per failed assertion
 */
const checkExpectations = (panel, index, results) =>
  panel.expect.flatMap((expectation, i) => {
    const actual = results[i];
    const failures = [];
    if (expectation.count !== undefined && actual.count !== expectation.count) {
      failures.push(
        `panel ${index} (${panel.story}): expected ${expectation.count} × \`${expectation.selector}\`, rendered ${actual.count}`,
      );
    }
    if (
      expectation.text !== undefined &&
      !actual.text.includes(expectation.text)
    ) {
      failures.push(
        `panel ${index} (${panel.story}): \`${expectation.selector}\` does not contain ${JSON.stringify(expectation.text)} — rendered ${JSON.stringify(actual.text.slice(0, 120))}`,
      );
    }
    return failures;
  });

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const spec = normalizeFigureSpec(
    JSON.parse(await readFile(resolve(args.spec), "utf8")),
  );
  const outPath = spec.out;

  const storybook = args.storybookUrl
    ? { url: args.storybookUrl.replace(/\/$/, ""), stop: () => undefined }
    : await startStorybook();

  /** @type {import("playwright").Browser | null} */
  let browser = null;
  try {
    const index = await waitForStorybook(storybook.url, 30_000);
    const unknown = findUnknownStories(
      /** @type {any} */ (index),
      spec.panels.map((panel) => panel.story),
    );
    if (unknown.length > 0) {
      throw new Error(
        unknown
          .map(
            (entry) =>
              `unknown story id "${entry.id}"${
                entry.suggestions.length > 0
                  ? `\n  did you mean:\n    ${entry.suggestions.join("\n    ")}`
                  : ""
              }`,
          )
          .join("\n"),
      );
    }

    const playwright = await import("playwright");
    const launched = await launchBrowser(playwright, args.browser);
    browser = launched.browser;
    const context = await browser.newContext({
      viewport: { width: spec.width, height: 800 },
      deviceScaleFactor: spec.scale,
      colorScheme: "light",
    });

    // Serve the three declared faces locally. A font request that never
    // settles keeps `document.fonts.ready` pending, and Playwright waits on it
    // before every screenshot — the capture then times out or, worse, renders
    // in the fallback face and still produces a file (#3106).
    if (existsSync(LOCAL_FONTS)) {
      await context.route(`${CDN_FONTS}*`, async (route) => {
        const file = new URL(route.request().url()).pathname.split("/").pop();
        await route.fulfill({
          body: await readFile(join(LOCAL_FONTS, String(file))),
          contentType: "font/woff2",
        });
      });
    }

    const page = await context.newPage();
    const urls = spec.panels.map((panel) =>
      buildStoryUrl(storybook.url, panel),
    );
    const html = composeFigureHtml({
      width: spec.width,
      background: spec.background,
      panels: spec.panels,
      urls,
    });

    // The composition page is served ON the Storybook origin, so it is
    // same-origin with the story iframes and can measure and assert them.
    const figureUrl = `${storybook.url}/__release-figure__.html`;
    await page.route(figureUrl, (route) =>
      route.fulfill({ contentType: "text/html; charset=utf-8", body: html }),
    );
    await page.goto(figureUrl, { waitUntil: "load" });

    const failures = [];
    for (const [index, panel] of spec.panels.entries()) {
      const measured = await measurePanel(
        page,
        index,
        panel.expect,
        panel.story,
      );
      failures.push(...checkExpectations(panel, index, measured.results));
      await page.evaluate(
        `${SIZE_PANEL}(${JSON.stringify({
          index,
          height: measured.height,
          inset: measured.insetLeft,
        })})`,
      );
    }
    if (failures.length > 0) {
      throw new Error(
        `the capture would not show what the spec asks for:\n  ${failures.join("\n  ")}`,
      );
    }

    await mkdir(dirname(resolve(repoRoot, outPath)), { recursive: true });
    const png = await page.locator("#figure").screenshot();
    await writeFile(resolve(repoRoot, outPath), png);

    const pixelWidth = spec.width * spec.scale;
    process.stdout.write(
      [
        `Wrote ${outPath}`,
        `  panels:  ${spec.panels.length} (${spec.panels.map((p) => p.story).join(", ")})`,
        `  browser: ${launched.name}`,
        `  layout:  ${spec.width} CSS px wide, captured at ${spec.scale}×`,
        `  image:   ${pixelWidth} px wide — the size it is shown at where nothing constrains it`,
        `  url:     ${rawFigureUrl("0".repeat(40), outPath).replace("0".repeat(40), "<commit-sha>")}`,
        "",
        "Open the file and look at it before it goes anywhere: a clipped or",
        "wrongly framed capture renders fine and reads as plausible.",
        "",
      ].join("\n"),
    );
    if (pixelWidth > COMFORTABLE_DISPLAY_WIDTH) {
      process.stdout.write(
        `Note: ${pixelWidth} px is wider than a release body (~${COMFORTABLE_DISPLAY_WIDTH} px), so\n` +
          `both surfaces will scale it down. Lower \`width\` or \`scale\` if the\n` +
          `figure should be read at its natural size.\n`,
      );
    }
  } finally {
    if (browser) await browser.close();
    storybook.stop();
  }
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
