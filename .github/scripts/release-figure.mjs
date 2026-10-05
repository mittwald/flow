#!/usr/bin/env node
// @ts-check
/**
 * Capture a release-notes figure from real Styleguide examples (#3030).
 *
 * ```shell
 * pnpm release:figure --spec <spec.json> [--docs-url http://localhost:3001]
 * ```
 *
 * The spec names the examples and what each panel must render. The script
 * stacks the panels into one PNG per theme (`<name>.png`, `<name>-dark.png`)
 * under `apps/docs/public/assets/releases/<version>/` and prints the
 * `<picture>` block the notes reference them by.
 *
 * It captures; it never invents. Every pixel comes from an example rendered out
 * of the working tree, and the script has no path that produces an image
 * without one. The examples come from the Styleguide, not from Storybook: the
 * figures are served from the docs site, and the stories' Star Wars fixtures
 * are out of place there.
 *
 * Why a script rather than a recipe in the slash command: every trap below cost
 * real time once, and each is invisible in the result — a capture that renders
 * the wrong state, or loses its bottom edge, looks entirely plausible.
 *
 * - **Playwright resolves only from the repo root.** A capture script run from a
 *   scratch directory dies with `ERR_MODULE_NOT_FOUND: Cannot find package
 *   'playwright'`. This file lives in the repo and the `pnpm` alias always runs
 *   from the root, so the resolution cannot drift.
 * - **`/example-preview/` exists under `next dev` only** (`page.dev.tsx`, see the
 *   docs' `next.config.js`), so the static export never ships it. The script
 *   therefore needs a docs dev server, never a build.
 * - **Server-rendered is not rendered.** Next sends the example's markup before
 *   React hydrates it, and whatever appears only on the client — an open
 *   overlay — is missing from it. The stage sets `data-ready` once it mounted,
 *   and nothing is measured before that.
 * - **An example that throws still renders a page** — react-live shows the error
 *   in place of the preview. The capture aborts on it.
 * - **Next's dev indicator sits in every frame**, bottom left. The script hides
 *   it in each frame rather than switching it off for everyone's `next dev`.
 * - **An iframe is sized by its content's `.bottom`, never its `.height`.** The
 *   rect is relative to the iframe viewport, so `.height` omits any offset
 *   above the content and clips exactly that many pixels off the bottom.
 * - **Port 3000 is often held** by a docs server from another worktree, so the
 *   script picks a free port instead of assuming one.
 * - **A hanging webfont never settles `document.fonts.ready`**, which Playwright
 *   waits on before every screenshot (#3106). The three faces `fonts.scss`
 *   declares are served from the local copies the visual suite already keeps.
 *   Playwright settles the composition page's fonts, never the example frames'
 *   own — and the composition page has no webfonts, so nothing else waits for
 *   these at all. Each panel therefore checks its iframe's own font status and
 *   is not measured until it is `loaded`; a face that never arrives aborts the
 *   run rather than producing a figure in the fallback face.
 * - **Nothing waits for an example's `<img>` either.** Measured before it loads,
 *   an image has no intrinsic size: the panel comes out ~80px tall and the
 *   figure shows a thin strip of the picture. Each panel waits until every
 *   image in its iframe has loaded; a broken one aborts the run.
 * - **Charts draw in after they mounted**, and an overlay fades in. A single
 *   screenshot catches them half-way, so the figure is shot until two
 *   consecutive captures are identical.
 * - **`pnpm test:browser:prepare` installs only Firefox and WebKit**, so a clean
 *   checkout has no Chromium. The browser is chosen from what is actually
 *   installed, and the capture names the one it used.
 */

import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { glob, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { URL, fileURLToPath } from "node:url";
import {
  EXAMPLE_GLOB,
  FIGURE_THEMES,
  buildExampleUrl,
  composeFigureHtml,
  examplePathOf,
  figureMarkdown,
  findUnknownExamples,
  normalizeFigureSpec,
  themedOutputPath,
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
 *   docsUrl: string | null;
 *   browser: string | null;
 * }}
 */
const parseArgs = (argv) => {
  const args = { spec: "", docsUrl: null, browser: null };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s);
    const value = inline ?? argv[++i];
    if (flag === "--spec") args.spec = value;
    else if (flag === "--docs-url") args.docsUrl = value;
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
 * Poll until `url` answers 200, or until `signal` says to stop. `next dev`
 * compiles a route on its first request, so the first answer can take a while.
 *
 * The signal is not a nicety: without it the loop's own timers keep the event
 * loop alive for the whole timeout, so a run that has already failed still sits
 * there for five minutes after reporting why.
 *
 * @param {string} url
 * @param {number} timeoutMs
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 */
const waitForPage = async (url, timeoutMs, signal) => {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not started";
  while (Date.now() < deadline && !signal?.aborted) {
    try {
      const response = await globalThis.fetch(url, { signal });
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = /** @type {Error} */ (error).message;
    }
    await sleep(500, undefined, { signal });
  }
  throw new Error(`${url} did not answer: ${lastError}`);
};

/**
 * Start the docs dev server on a free port and return it plus a stop handle.
 *
 * `pnpm nx dev docs` is the graph target — it builds every workspace dependency
 * first. A bare `next dev` would render whatever `dist` happens to hold, which
 * for a release figure is precisely the wrong thing.
 *
 * The chain is `pnpm → nx → next dev`, and signalling only the `pnpm` wrapper
 * can leave the inner dev server holding the port. Worse, an orphan keeps the
 * inherited stdout/stderr pipes open, so this script would not exit either.
 * `detached` puts the whole chain in its own process group, which the stop
 * handle then signals as a group.
 *
 * @param {string} readyPath A page that must answer before the server counts as
 *   up
 * @returns {Promise<{ url: string; stop: () => void }>}
 */
const startDocs = async (readyPath) => {
  const port = await freePort();
  const url = `http://localhost:${port}`;
  process.stderr.write(`Starting the docs dev server on ${url} …\n`);
  const child = spawn(
    "pnpm",
    ["nx", "dev", "docs", "--", "--port", String(port)],
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"], detached: true },
  );
  const log = [];
  child.stdout.on("data", (chunk) => log.push(String(chunk)));
  child.stderr.on("data", (chunk) => log.push(String(chunk)));

  const stop = () => {
    try {
      // Negative pid = the process group, i.e. nx and next too.
      process.kill(-child.pid, "SIGTERM");
    } catch {
      // Already gone; nothing to signal.
    }
  };

  // A server that dies during the build never answers, and polling it to the
  // full timeout hides the build error for five minutes. Aborting the poll is
  // the other half: losing the race is not enough, because the loop's pending
  // timer would keep the process alive until the timeout.
  const abort = new globalThis.AbortController();
  const died = new Promise((_ignored, reject) => {
    child.on("exit", (code, signal) => {
      abort.abort();
      reject(
        new Error(
          `the docs dev server exited before it was ready (code ${code}, signal ${signal})`,
        ),
      );
    });
  });

  try {
    await Promise.race([
      waitForPage(`${url}${readyPath}`, 300_000, abort.signal),
      died,
    ]);
  } catch (error) {
    stop();
    process.stderr.write(log.join(""));
    throw error;
  }
  return { url, stop };
};

/**
 * Hide Next's dev indicator. It is a fixed badge in every page `next dev`
 * serves, the example frames included.
 */
const HIDE_DEV_INDICATOR = `(() => {
  const style = document.createElement('style');
  style.textContent = 'nextjs-portal { display: none !important; }';
  document.addEventListener('DOMContentLoaded', () => document.head.append(style));
})()`;

/**
 * Wait for one panel's example to be rendered, then report the height its
 * content needs and what it rendered.
 *
 * Runs inside the composition page, which is same-origin with the example
 * iframes — that is the only reason it can reach into `contentDocument` at
 * all.
 */
const MEASURE_PANEL = `(async ({ index, expectations }) => {
  const frame = document.querySelector('iframe[data-panel="' + index + '"]');
  const doc = frame.contentDocument;
  const error = doc.querySelector('[data-live-error]');
  if (error) return { error: error.textContent };
  const stage = doc.querySelector('[data-example-stage][data-ready]');
  if (!stage) return null;
  // Each iframe has its OWN font set. Playwright settles the composition page's
  // fonts before a screenshot, never the frames' — and the composition page has
  // no webfonts at all, so nothing else waits for these. Measuring early sizes
  // and captures the fallback face, which changes wrapping and the bottom edge:
  // the #3106 failure mode.
  //
  // The race only bounds how long ONE evaluate may block. The status check
  // after it is what decides: still loading means this panel is not ready, so
  // report nothing and let measurePanel's 30s deadline abort loudly rather than
  // return a figure rendered in the wrong face.
  await Promise.race([
    doc.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
  if (doc.fonts.status !== 'loaded') return null;
  // An unloaded <img> has no intrinsic size yet, so the panel measures a few
  // pixels tall and the capture shows a thin strip of it. Same pattern as the
  // fonts: the race bounds one evaluate, the check after it decides. A broken
  // image counts as not ready too — it must abort, not land in the figure.
  const images = [...doc.images];
  await Promise.race([
    Promise.all(images.map((img) => img.decode().catch(() => {}))),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
  if (images.some((img) => !img.complete || img.naturalWidth === 0)) {
    return null;
  }
  // .bottom, not .height: the rect is relative to the iframe viewport, so
  // .height alone omits whatever sits above the stage.
  const height = stage.getBoundingClientRect().bottom;
  if (!(height > 0)) return null;
  return {
    height: Math.ceil(height),
    insetLeft: getComputedStyle(stage).paddingLeft,
    // The whole document, not the stage: an overlay renders into a portal.
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

/** Give one panel's iframe the height its content measured. */
const SIZE_PANEL = `(({ index, height }) => {
  document.querySelector('iframe[data-panel="' + index + '"]').style.height =
    height + 'px';
})`;

/**
 * Align the captions with the stage's own inset, so the figure reads as one
 * page. Set once, from the first panel — every stage shares the inset.
 */
const SET_CAPTION_INSET = `((inset) => {
  document.documentElement.style.setProperty('--caption-inset', inset);
})`;

/**
 * @param {{
 *   example: string;
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
        `panel ${index} (${panel.example}): expected ${expectation.count} × \`${expectation.selector}\`, rendered ${actual.count}`,
      );
    }
    if (
      expectation.text !== undefined &&
      !actual.text.includes(expectation.text)
    ) {
      failures.push(
        `panel ${index} (${panel.example}): \`${expectation.selector}\` does not contain ${JSON.stringify(expectation.text)} — rendered ${JSON.stringify(actual.text.slice(0, 120))}`,
      );
    }
    return failures;
  });

/**
 * Measure one panel once it is ready and its expectations hold. Content that
 * appears after mount — a chart's bars, an overlay — gets until the deadline;
 * past it, whatever the panel rendered then is what the expectations are
 * reported against.
 *
 * @param {import("playwright").Page} page
 * @param {number} index
 * @param {{
 *   example: string;
 *   expect: { selector: string; count?: number; text?: string }[];
 * }} panel
 * @param {string} url The panel's example page, for the error message
 * @returns {Promise<{
 *   height: number;
 *   insetLeft: string;
 *   failures: string[];
 * }>}
 */
const measurePanel = async (page, index, panel, url) => {
  const deadline = Date.now() + 30_000;
  for (;;) {
    const measured = /** @type {any} */ (
      await page.evaluate(
        `${MEASURE_PANEL}(${JSON.stringify({ index, expectations: panel.expect })})`,
      )
    );
    if (measured?.error !== undefined) {
      throw new Error(
        `panel ${index} (${panel.example}) threw instead of rendering:\n  ${measured.error}`,
      );
    }
    const failures = measured
      ? checkExpectations(panel, index, measured.results)
      : [];
    if (measured && (failures.length === 0 || Date.now() > deadline)) {
      return { ...measured, failures };
    }
    if (Date.now() > deadline) {
      throw new Error(
        `panel ${index} (${panel.example}) never became ready within 30s — either it never mounted, or its fonts or images never finished loading. Open ${url} and check its console and network tab`,
      );
    }
    await sleep(250);
  }
};

/**
 * Screenshot the figure until two consecutive captures are identical.
 *
 * @param {import("playwright").Locator} figure
 * @returns {Promise<Buffer>}
 */
const captureSettled = async (figure) => {
  let previous = await figure.screenshot();
  for (let attempt = 0; attempt < 40; attempt++) {
    await sleep(250);
    const current = await figure.screenshot();
    if (current.equals(previous)) return current;
    previous = current;
  }
  throw new Error(
    "the figure never settled — two consecutive screenshots differed for 10s. Something in it keeps animating",
  );
};

/**
 * Capture one theme of the figure into `out`.
 *
 * @param {import("playwright").Browser} browser
 * @param {string} docsUrl
 * @param {import("./release-figure-lib.mjs").NormalizedFigureSpec} spec
 * @param {import("./release-figure-lib.mjs").FigureTheme} theme
 * @param {string} out
 */
const captureTheme = async (browser, docsUrl, spec, theme, out) => {
  const context = await browser.newContext({
    viewport: { width: spec.width, height: 800 },
    deviceScaleFactor: spec.scale,
    // The preview layout follows the system theme, so this alone themes the
    // examples.
    colorScheme: theme,
  });
  try {
    await context.addInitScript(HIDE_DEV_INDICATOR);

    // Serve the three declared faces locally. A font request that never
    // settles keeps `document.fonts.ready` pending, and Playwright waits on it
    // before every screenshot — the capture then times out or, worse, renders
    // in the fallback face and still produces a file (#3106).
    if (existsSync(LOCAL_FONTS)) {
      await context.route(`${CDN_FONTS}*`, async (route) => {
        const file = new URL(route.request().url()).pathname.split("/").pop();
        const local = join(LOCAL_FONTS, String(file));
        // A face added to fonts.scss has no local copy yet. Throwing here would
        // leave the request unanswered, which is the one thing that must not
        // happen to a font — let it go to the network instead.
        if (!existsSync(local)) {
          process.stderr.write(
            `No local copy of ${file}; fetching it from the CDN.\n`,
          );
          await route.continue();
          return;
        }
        await route.fulfill({
          body: await readFile(local),
          contentType: "font/woff2",
        });
      });
    }

    const page = await context.newPage();
    const urls = spec.panels.map((panel) =>
      buildExampleUrl(docsUrl, panel.example),
    );
    const html = composeFigureHtml({
      width: spec.width,
      theme,
      panels: spec.panels,
      urls,
    });

    // The composition page is served ON the docs origin, so it is same-origin
    // with the example iframes and can measure and assert them.
    const figureUrl = `${docsUrl}/__release-figure__.html`;
    await page.route(figureUrl, (route) =>
      route.fulfill({ contentType: "text/html; charset=utf-8", body: html }),
    );
    await page.goto(figureUrl, { waitUntil: "load" });

    const failures = [];
    for (const [index, panel] of spec.panels.entries()) {
      const measured = await measurePanel(page, index, panel, urls[index]);
      failures.push(...measured.failures);
      await page.evaluate(
        `${SIZE_PANEL}(${JSON.stringify({ index, height: measured.height })})`,
      );
      if (index === 0) {
        await page.evaluate(
          `${SET_CAPTION_INSET}(${JSON.stringify(measured.insetLeft)})`,
        );
      }
    }
    if (failures.length > 0) {
      throw new Error(
        `the ${theme} capture would not show what the spec asks for:\n  ${failures.join("\n  ")}`,
      );
    }

    await mkdir(dirname(resolve(repoRoot, out)), { recursive: true });
    const png = await captureSettled(page.locator("#figure"));
    await writeFile(resolve(repoRoot, out), png);
  } finally {
    await context.close();
  }
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const spec = normalizeFigureSpec(
    JSON.parse(await readFile(resolve(args.spec), "utf8")),
  );
  // Checked against the working tree before any server starts: a typo would
  // otherwise surface as a 404 page, minutes into the run.
  const known = [];
  for await (const file of glob(EXAMPLE_GLOB, { cwd: repoRoot })) {
    known.push(examplePathOf(file.split("\\").join("/")));
  }
  const unknown = findUnknownExamples(
    known.sort(),
    spec.panels.map((panel) => panel.example),
  );
  if (unknown.length > 0) {
    throw new Error(
      unknown
        .map(
          (entry) =>
            `unknown example "${entry.path}"${
              entry.suggestions.length > 0
                ? `\n  did you mean:\n    ${entry.suggestions.join("\n    ")}`
                : ""
            }`,
        )
        .join("\n"),
    );
  }

  const readyPath = new URL(buildExampleUrl("http://x", spec.panels[0].example))
    .pathname;
  const docs = args.docsUrl
    ? { url: args.docsUrl.replace(/\/$/, ""), stop: () => undefined }
    : await startDocs(readyPath);

  /** @type {import("playwright").Browser | null} */
  let browser = null;
  try {
    // Also compiles the route once, before the frames all request it at once.
    await waitForPage(`${docs.url}${readyPath}`, 120_000);

    const playwright = await import("playwright");
    const launched = await launchBrowser(playwright, args.browser);
    browser = launched.browser;

    const written = [];
    for (const theme of FIGURE_THEMES) {
      const out = themedOutputPath(spec.out, theme);
      await captureTheme(browser, docs.url, spec, theme, out);
      written.push(out);
    }

    const pixelWidth = spec.width * spec.scale;
    const placeholderSha = "0".repeat(40);
    const snippet = figureMarkdown({
      sha: placeholderSha,
      out: spec.out,
      alt: "<caption>",
    }).replaceAll(placeholderSha, "<commit-sha>");
    process.stdout.write(
      [
        ...written.map((out) => `Wrote ${out}`),
        `  panels:  ${spec.panels.length} (${spec.panels.map((p) => p.example).join(", ")})`,
        `  browser: ${launched.name}`,
        `  layout:  ${spec.width} CSS px wide, captured at ${spec.scale}×`,
        `  image:   ${pixelWidth} px wide — the size it is shown at where nothing constrains it`,
        "",
        "Reference it from the notes as:",
        "",
        snippet,
        "",
        "Open both files and look at them before they go anywhere: a clipped or",
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
    docs.stop();
  }
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
