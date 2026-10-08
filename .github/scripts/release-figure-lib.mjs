// @ts-check
/**
 * Release-figure capture — pure helpers (no IO, no browser, no network).
 *
 * A release figure is a PNG of one or more real Styleguide examples, stacked
 * into a single image and committed under
 * `apps/docs/public/assets/releases/<version>/`. `/prepare-release` references
 * it from the curated notes by its commit-SHA raw URL (#3030).
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

/**
 * The CSS colors a background may use. Narrow on purpose: the value is
 * interpolated into the composition page's `<style>`, where anything
 * unconstrained could close the block.
 */
const CSS_COLOR =
  /^(transparent|#[0-9a-fA-F]{3,8}|(rgb|hsl)a?\([0-9a-zA-Z .,%/-]+\)|[a-zA-Z]+)$/;

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
 * The URL that renders one panel: the example alone, framed as on its page.
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
  return normalized;
};

/**
 * @typedef {object} NormalizedPanel
 * @property {string} example
 * @property {string | null} caption
 * @property {{ selector: string; count?: number; text?: string }[]} expect
 */

/**
 * @typedef {object} NormalizedFigureSpec
 * @property {string} version
 * @property {string} name
 * @property {string} out
 * @property {number} width
 * @property {number} scale
 * @property {string} background
 * @property {NormalizedPanel[]} panels
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

  // `scale` is the pixel density, not a display size. Markdown image syntax
  // carries no `width`, and the docs site's `<Markdown>` drops raw HTML, so
  // nothing can shrink the figure afterwards on both surfaces — `width` is
  // therefore the size it will be shown at (#3030).
  const scale = spec.scale ?? 2;
  check(
    scale === 1 || scale === 2 || scale === 3,
    `spec.scale (deviceScaleFactor) must be 1, 2 or 3, got ${scale}`,
  );

  const background = spec.background ?? "#ffffff";
  check(
    typeof background === "string" && CSS_COLOR.test(background),
    `spec.background must be a plain CSS color, got ${JSON.stringify(background)}`,
  );

  check(
    Array.isArray(spec.panels) && spec.panels.length > 0,
    "spec.panels must be a non-empty array",
  );

  const panels = spec.panels.map(
    (/** @type {any} */ panel, /** @type {number} */ index) => {
      const at = `panels[${index}]`;
      check(
        panel !== null && typeof panel === "object",
        `${at} must be an object`,
      );
      check(
        panel.story === undefined &&
          panel.args === undefined &&
          panel.globals === undefined,
        `${at} uses story/args/globals — figures are captured from Styleguide examples now: name one with ${at}.example`,
      );
      check(
        typeof panel.example === "string" && EXAMPLE_PATH.test(panel.example),
        `${at}.example is required — the page's content path plus the example name, e.g. components/form-controls/rating/max-value for src/content/components/form-controls/rating/examples/max-value.tsx`,
      );
      check(
        panel.caption === undefined || typeof panel.caption === "string",
        `${at}.caption must be a string when given`,
      );

      const expect = panel.expect ?? [];
      check(Array.isArray(expect), `${at}.expect must be an array`);
      expect.forEach((/** @type {any} */ item, /** @type {number} */ j) => {
        check(
          item !== null &&
            typeof item === "object" &&
            typeof item.selector === "string",
          `${at}.expect[${j}].selector is required`,
        );
        check(
          item.count === undefined || Number.isInteger(item.count),
          `${at}.expect[${j}].count must be an integer when given`,
        );
        check(
          item.text === undefined || typeof item.text === "string",
          `${at}.expect[${j}].text must be a string when given`,
        );
        check(
          item.count !== undefined || item.text !== undefined,
          `${at}.expect[${j}] must assert a count or a text`,
        );
      });

      return {
        example: panel.example,
        caption: panel.caption ?? null,
        expect,
      };
    },
  );

  return {
    version: spec.version,
    name: spec.name,
    out,
    width,
    scale,
    background,
    panels,
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
 * The composition page: one same-origin iframe per panel, stacked, each with an
 * optional monospace caption naming the prop it demonstrates.
 *
 * Same-origin is the point — the runner reads every iframe's document to
 * measure and to assert it. The page is therefore served on the docs origin
 * (the runner fulfils a route there), never from `file://`.
 *
 * An iframe starts tall and is shrunk to its content once measured: an overlay
 * positions itself against the frame's viewport, and the default 150px would
 * squeeze or flip it.
 *
 * @param {{
 *   width: number;
 *   background: string;
 *   panels: { caption: string | null }[];
 *   urls: string[];
 * }} args
 * @returns {string}
 */
export const composeFigureHtml = ({ width, background, panels, urls }) => {
  const body = panels
    .map((panel, index) => {
      const caption =
        panel.caption === null
          ? ""
          : `<p class="caption">${escapeHtml(panel.caption)}</p>`;
      const source = escapeHtml(urls[index]);
      return `<div class="panel">${caption}<iframe data-panel="${index}" src="${source}" scrolling="no" title="panel ${index}"></iframe></div>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>release figure</title><style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: ${background}; }
  #figure { width: ${width}px; overflow: hidden; }
  .panel + .panel { border-top: 1px solid #e4e6eb; }
  .caption {
    margin: 0;
    padding: 12px var(--caption-inset, 16px) 0;
    font: 12px/1.5 ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    color: #6b7280;
  }
  iframe { display: block; width: 100%; height: 2000px; border: 0; }
</style></head>
<body><div id="figure">${body}</div></body></html>`;
};
