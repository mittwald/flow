// @ts-check
/**
 * Release-figure capture — pure helpers (no IO, no browser, no network).
 *
 * A release figure is a PNG of exactly one real Styleguide example, committed
 * under `apps/docs/public/assets/releases/<version>/`. `/prepare-release`
 * references it from the curated notes by its commit-SHA raw URL (#3030).
 *
 * Everything here exists to make a capture FAIL rather than come out plausible
 * but wrong. That is the whole problem with screenshots: a figure that renders
 * the wrong state, or loses its bottom edge, looks fine in a diff and reads as
 * correct until someone opens the file.
 */

import { posix } from "node:path";

/**
 * Where committed figures live. Inside `public/assets/`, which is the
 * established home for docs images; a top-level `public/releases/` would have
 * collided in name with the `/releases` route.
 */
export const FIGURE_ROOT = "apps/docs/public/assets/releases";

const VERSION = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const FIGURE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SHA = /^[0-9a-f]{7,40}$/;

/**
 * An example path: the page's content path plus the example's name, e.g.
 * `components/content/heading/badge` for
 * `src/content/components/content/heading/examples/badge.tsx`.
 */
const EXAMPLE_PATH = /^[a-z0-9-]+(\/[a-z0-9-]+)*\/[a-zA-Z0-9_-]+$/;

/** Where the docs dev server serves one example on its own. */
const EXAMPLE_ROUTE = "/example-preview";

/** The source files `/example-preview/` serves, relative to the repo root. */
export const EXAMPLE_GLOB = "apps/docs/src/content/**/examples/*.tsx";

/** Every figure is captured once per theme. Light comes first. */
export const FIGURE_THEMES = /** @type {const} */ (["light", "dark"]);

/** @typedef {(typeof FIGURE_THEMES)[number]} FigureTheme */

/**
 * The composition page's ground behind the example frame, matching the stage's
 * `--elevation--color--100`.
 *
 * @type {Record<FigureTheme, string>}
 */
const FIGURE_GROUND = { light: "#ffffff", dark: "#1b1f24" };

export class FigureSpecError extends Error {}

/**
 * @param {unknown} condition
 * @param {string} message
 * @returns {asserts condition}
 */
const check = (condition, message) => {
  if (!condition) throw new FigureSpecError(message);
};

/**
 * The example path for one example source file, relative to the repo root.
 *
 * @param {string} file E.g.
 *   `apps/docs/src/content/components/x/y/examples/z.tsx`
 * @returns {string} E.g. `components/x/y/z`
 */
export const examplePathOf = (file) =>
  file
    .replace(/^apps\/docs\/src\/content\//, "")
    .replace(/\/examples\/([^/]+)\.tsx$/, "/$1");

/**
 * The source file of one example, relative to the repo root — the inverse of
 * {@link examplePathOf}.
 *
 * @param {string} example E.g. `components/x/y/z`
 * @returns {string} E.g. `apps/docs/src/content/components/x/y/examples/z.tsx`
 */
export const exampleSourcePath = (example) =>
  `apps/docs/src/content/${posix.dirname(example)}/examples/${posix.basename(example)}.tsx`;

/**
 * The URL that renders the figure's example: the example alone, framed as on
 * its page.
 *
 * @param {string} baseUrl Running docs dev server, e.g. `http://localhost:3001`
 * @param {string} example
 * @returns {string}
 */
export const buildExampleUrl = (baseUrl, example) =>
  `${baseUrl.replace(/\/$/, "")}${EXAMPLE_ROUTE}/${example}`;

/**
 * @param {string} version
 * @param {string} name
 * @returns {string}
 */
export const figureOutputPath = (version, name) => {
  check(
    VERSION.test(version),
    `version must be x.y.z (the graduated release version), got ${JSON.stringify(version)}`,
  );
  check(
    FIGURE_NAME.test(name),
    `figure name must be kebab-case, got ${JSON.stringify(name)}`,
  );
  return `${FIGURE_ROOT}/${version}/${name}.png`;
};

/**
 * The file one theme's capture is written to: the spec's path for light, the
 * same path with `-dark` before the extension for dark.
 *
 * @param {string} out A normalized `.png` path from the spec
 * @param {FigureTheme} theme
 * @returns {string}
 */
export const themedOutputPath = (out, theme) =>
  theme === "light" ? out : out.replace(/\.png$/, "-dark.png");

/**
 * The release-notes snippet for one figure. GitHub picks the `<source>` in dark
 * mode; the docs site rewrites the block (`themedFigures` in
 * `apps/docs/src/lib/releases`), because its markdown drops raw HTML.
 *
 * `width` is the spec's CSS width, i.e. the capture's scale undone. Without it
 * GitHub stretches the figure to the full body width. `themedFigures` reads
 * only `src` and `alt`, so `/releases` ignores it and keeps the figure.
 *
 * @param {{ sha: string; out: string; alt: string; width: number }} args
 * @returns {string}
 */
export const figureMarkdown = ({ sha, out, alt, width }) =>
  [
    "<picture>",
    `  <source media="(prefers-color-scheme: dark)" srcset="${rawFigureUrl(sha, themedOutputPath(out, "dark"))}">`,
    `  <img src="${rawFigureUrl(sha, out)}" alt="${escapeHtml(alt)}" width="${width}">`,
    "</picture>",
  ].join("\n");

/**
 * The URL the release notes reference. A commit SHA, never a branch: it
 * resolves the moment the commit exists (during PR review) and keeps resolving
 * after `release/x.y.0` is deleted post-merge.
 *
 * @param {string} sha
 * @param {string} outPath
 * @returns {string}
 */
export const rawFigureUrl = (sha, outPath) => {
  check(SHA.test(sha), `expected a commit SHA, got ${JSON.stringify(sha)}`);
  check(
    outPath.startsWith(`${FIGURE_ROOT}/`),
    `figure must live under ${FIGURE_ROOT}/, got ${outPath}`,
  );
  return `https://raw.githubusercontent.com/mittwald/flow/${sha}/${outPath}`;
};

/**
 * Confine a figure's output path to the release-assets tree.
 *
 * `startsWith` alone is not containment: `…/releases/1.2.0/../../../x.png`
 * passes it and then resolves outside the tree. The extension is checked here
 * too, because the capture always writes PNG bytes — a `.jpg` path would name a
 * file that is not what it contains.
 *
 * @param {unknown} out
 * @returns {string} The normalized repo-relative path
 */
export const resolveOutputPath = (out) => {
  check(typeof out === "string", "spec.out must be a string when given");
  // The notes reference the figure by its commit-SHA raw URL, so it has to be
  // a committed repo path — an absolute or scratch path cannot be referenced
  // at all, and finding that out after the capture wastes the whole run.
  const normalized = posix.normalize(out);
  check(
    normalized === out &&
      !posix.isAbsolute(normalized) &&
      normalized.startsWith(`${FIGURE_ROOT}/`) &&
      !normalized.split("/").includes(".."),
    `spec.out must be a normalized repo path under ${FIGURE_ROOT}/, got ${JSON.stringify(out)}`,
  );
  check(
    normalized.endsWith(".png"),
    `spec.out must end in .png — the capture writes PNG bytes, got ${JSON.stringify(out)}`,
  );
  // Checked on the final path, so it covers a given `out` as well as one
  // derived from `name`.
  check(
    !normalized.endsWith("-dark.png"),
    `spec.out must not end in -dark.png — that suffix marks the dark capture, got ${JSON.stringify(out)}`,
  );
  return normalized;
};

/**
 * @typedef {object} NormalizedFigureSpec
 * @property {string} version
 * @property {string} name
 * @property {string} out
 * @property {number} width
 * @property {number} scale
 * @property {string} example
 * @property {{ selector: string; count?: number; text?: string }[]} expect
 * @property {Record<string, string>} replace
 */

/**
 * Validate and default a figure spec.
 *
 * @param {unknown} raw
 * @returns {NormalizedFigureSpec}
 */
export const normalizeFigureSpec = (raw) => {
  check(
    raw !== null && typeof raw === "object" && !Array.isArray(raw),
    "spec must be a JSON object",
  );
  const spec = /** @type {Record<string, any>} */ (raw);

  check(typeof spec.version === "string", "spec.version is required (x.y.z)");
  check(typeof spec.name === "string", "spec.name is required (kebab-case)");
  const out = resolveOutputPath(
    spec.out ?? figureOutputPath(spec.version, spec.name),
  );

  const width = spec.width ?? 700;
  check(
    typeof width === "number" && width >= 200 && width <= 2000,
    `spec.width must be 200..2000 CSS px, got ${width}`,
  );

  // `scale` is the pixel density, not a display size. `width` is the size the
  // figure is shown at: GitHub takes it from the `<img width>` the snippet
  // carries, `/releases` zooms every figure back by the default scale of 2.
  const scale = spec.scale ?? 2;
  check(
    scale === 1 || scale === 2 || scale === 3,
    `spec.scale (deviceScaleFactor) must be 1, 2 or 3, got ${scale}`,
  );

  check(
    spec.background === undefined,
    "spec.background is gone — each theme brings its own ground",
  );

  // One example per figure, and no caption baked into the PNG: the notes give
  // every figure its own heading and text instead (#3481). A comparison is two
  // figures.
  check(
    spec.panels === undefined,
    "spec.panels is gone — a figure shows exactly one example: name it with spec.example, and capture a comparison as two figures",
  );
  check(
    spec.caption === undefined,
    "spec.caption is gone — the notes carry the figure's heading and text",
  );
  check(
    spec.story === undefined &&
      spec.args === undefined &&
      spec.globals === undefined,
    "spec uses story/args/globals — figures are captured from Styleguide examples: name one with spec.example",
  );
  check(
    typeof spec.example === "string" && EXAMPLE_PATH.test(spec.example),
    "spec.example is required — the page's content path plus the example name, e.g. components/form-controls/rating/max-value for src/content/components/form-controls/rating/examples/max-value.tsx",
  );

  const expect = spec.expect ?? [];
  check(Array.isArray(expect), "spec.expect must be an array");
  expect.forEach((/** @type {any} */ item, /** @type {number} */ j) => {
    check(
      item !== null &&
        typeof item === "object" &&
        typeof item.selector === "string",
      `spec.expect[${j}].selector is required`,
    );
    check(
      item.count === undefined || Number.isInteger(item.count),
      `spec.expect[${j}].count must be an integer when given`,
    );
    check(
      item.text === undefined || typeof item.text === "string",
      `spec.expect[${j}].text must be a string when given`,
    );
    check(
      item.count !== undefined || item.text !== undefined,
      `spec.expect[${j}] must assert a count or a text`,
    );
  });

  const replace = spec.replace ?? {};
  check(
    replace !== null && typeof replace === "object" && !Array.isArray(replace),
    "spec.replace must be an object mapping source text to its replacement",
  );
  for (const [from, to] of Object.entries(replace)) {
    check(
      from.trim() !== "",
      "spec.replace keys must not be empty or whitespace",
    );
    check(
      typeof to === "string",
      `spec.replace[${JSON.stringify(from)}] must be a string ("" removes the text)`,
    );
  }

  return {
    version: spec.version,
    name: spec.name,
    out,
    width,
    scale,
    example: spec.example,
    expect,
    replace,
  };
};

/**
 * @param {string} value
 * @returns {string}
 */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The pattern one `replace` key matches.
 *
 * A space in the key matches any whitespace run: prettier wraps long strings
 * and JSX across lines, so the key can be written as the text reads. Between
 * two words it needs at least one whitespace character; next to punctuation it
 * may be none, because prettier moves a `>` onto its own line. A key that
 * begins or ends with a letter or digit does not match inside a longer word, so
 * `Projekt` leaves `Projekte` alone instead of mangling it.
 *
 * @param {string} key
 * @returns {string}
 */
const replacePattern = (key) => {
  const word = /[\p{L}\p{N}]/u;
  const parts = key.trim().split(/\s+/);
  const body = parts
    .map((part, i) => {
      if (i === 0) return escapeRegExp(part);
      const between =
        word.test(parts[i - 1].at(-1) ?? "") && word.test(part[0]);
      return `${between ? "\\s+" : "\\s*"}${escapeRegExp(part)}`;
    })
    .join("");
  const before = word.test(parts[0][0]) ? "(?<![\\p{L}\\p{N}])" : "";
  const after = word.test(parts.at(-1)?.at(-1) ?? "")
    ? "(?![\\p{L}\\p{N}])"
    : "";
  return `${before}${body}${after}`;
};

/**
 * Apply a spec's `replace` map to an example's source: translate its visible
 * strings to English, change its initial state, strip a demo-only control.
 *
 * One pass over the source, longest key first, so a phrase wins over a word it
 * contains and no replacement is replaced again. Every key has to match: one
 * that matches nothing is a typo or a stale map, and the figure would silently
 * keep the original text.
 *
 * @param {string} source
 * @param {Record<string, string>} replace
 * @returns {{ source: string; unmatched: string[] }}
 */
export const applyReplacements = (source, replace) => {
  const keys = Object.keys(replace).sort(
    (a, b) => b.trim().length - a.trim().length,
  );
  if (keys.length === 0) return { source, unmatched: [] };

  const pattern = new RegExp(
    keys.map((key) => `(${replacePattern(key)})`).join("|"),
    "gu",
  );
  const matched = new Set();
  const replaced = source.replace(pattern, (...groups) => {
    const index = groups
      .slice(1, keys.length + 1)
      .findIndex((group) => group !== undefined);
    matched.add(keys[index]);
    return replace[keys[index]];
  });
  return {
    source: replaced,
    unmatched: keys.filter((key) => !matched.has(key)),
  };
};

/**
 * Example paths that name no example, each with the closest ones that do — a
 * typo otherwise ends as a 404 page in the figure.
 *
 * @param {string[]} known Every example path
 * @param {string[]} paths
 * @returns {{ path: string; suggestions: string[] }[]}
 */
export const findUnknownExamples = (known, paths) => {
  const knownSet = new Set(known);
  return paths
    .filter((path) => !knownSet.has(path))
    .map((path) => {
      const page = posix.dirname(path);
      const name = posix.basename(path);
      const suggestions = known
        .filter(
          (candidate) =>
            posix.dirname(candidate) === page ||
            posix.basename(candidate) === name,
        )
        .slice(0, 8);
      return { path, suggestions };
    });
};

/**
 * @param {string} value
 * @returns {string}
 */
const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

/**
 * The composition page: the example in one same-origin iframe.
 *
 * Same-origin is the point — the runner reads the iframe's document to measure
 * and to assert it. The page is therefore served on the docs origin (the runner
 * fulfils a route there), never from `file://`.
 *
 * The iframe starts tall and is shrunk to its content once measured: an overlay
 * positions itself against the frame's viewport, and the default 150px would
 * squeeze or flip it.
 *
 * @param {{ width: number; theme: FigureTheme; url: string }} args
 * @returns {string}
 */
export const composeFigureHtml = ({ width, theme, url }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>release figure</title><style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: ${FIGURE_GROUND[theme]}; }
  #figure { width: ${width}px; overflow: hidden; }
  iframe { display: block; width: 100%; height: 2000px; border: 0; }
</style></head>
<body><div id="figure"><iframe id="example" src="${escapeHtml(url)}" scrolling="no" title="example"></iframe></div></body></html>`;
