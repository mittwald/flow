// @ts-check
/**
 * Release-figure capture — pure helpers (no IO, no browser, no network).
 *
 * A release figure is a PNG of one or more real Storybook stories, stacked into
 * a single image and committed under
 * `apps/docs/public/assets/releases/<version>/`. `/prepare-release` references
 * it from the curated notes by its commit-SHA raw URL (#3030).
 *
 * Everything here exists to make a capture FAIL rather than come out plausible
 * but wrong. That is the whole problem with screenshots: a figure that renders
 * the wrong state, or loses its bottom edge, looks fine in a diff and reads as
 * correct until someone opens the file.
 */

import { posix } from "node:path";
import { URLSearchParams } from "node:url";

/**
 * Where committed figures live. Inside `public/assets/`, which is the
 * established home for docs images; a top-level `public/releases/` would have
 * collided in name with the `/releases` route.
 */
export const FIGURE_ROOT = "apps/docs/public/assets/releases";

/**
 * Storybook's own `VALIDATION_REGEXP` for arg keys and string values
 * (`storybook/dist/router`). A key or value outside it is dropped from the URL
 * silently — one half of the reason every panel must also assert its DOM.
 */
const STORYBOOK_TOKEN = /^[a-zA-Z0-9 _-]*$/;
const STORYBOOK_NUMBER = /^-?[0-9]+(\.[0-9]+)?$/;

const VERSION = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const FIGURE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SHA = /^[0-9a-f]{7,40}$/;

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
 * Encode one `args=` / `globals=` record the way Storybook parses it back.
 *
 * Throws on anything Storybook would drop, rather than emitting a URL that
 * renders the default state and looks like a successful capture.
 *
 * @param {Record<string, string | number | boolean>} record
 * @returns {string}
 */
export const encodeStorybookParam = (record) =>
  Object.entries(record)
    .map(([key, value]) => {
      check(
        STORYBOOK_TOKEN.test(key),
        `arg key ${JSON.stringify(key)} is not [a-zA-Z0-9 _-]* — Storybook drops it from the URL`,
      );
      if (typeof value === "boolean") return `${key}:!${value}`;
      if (typeof value === "number") {
        check(
          Number.isFinite(value),
          `arg ${key} must be a finite number, got ${value}`,
        );
        return `${key}:${value}`;
      }
      check(
        typeof value === "string",
        `arg ${key} must be a string, number or boolean — objects and arrays are not supported here`,
      );
      check(
        STORYBOOK_TOKEN.test(value) || STORYBOOK_NUMBER.test(value),
        `arg ${key}=${JSON.stringify(value)} is not [a-zA-Z0-9 _-]* — Storybook drops it from the URL`,
      );
      return `${key}:${value}`;
    })
    .join(";");

/**
 * The `iframe.html` URL that renders one panel.
 *
 * @param {string} baseUrl Running Storybook, e.g. `http://localhost:6007`
 * @param {{
 *   story: string;
 *   args?: Record<string, string | number | boolean>;
 *   globals?: Record<string, string | number | boolean>;
 * }} panel
 * @returns {string}
 */
export const buildStoryUrl = (baseUrl, panel) => {
  const params = new URLSearchParams({ id: panel.story, viewMode: "story" });
  // Storybook parses `args` / `globals` itself; URLSearchParams would
  // percent-encode the `:` and `;` separators it expects, so append them raw.
  const extra = /** @type {string[]} */ ([]);
  if (panel.args && Object.keys(panel.args).length > 0) {
    extra.push(`args=${encodeStorybookParam(panel.args)}`);
  }
  if (panel.globals && Object.keys(panel.globals).length > 0) {
    extra.push(`globals=${encodeStorybookParam(panel.globals)}`);
  }
  const query = [params.toString(), ...extra].join("&");
  return `${baseUrl.replace(/\/$/, "")}/iframe.html?${query}`;
};

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
 * @property {string} story
 * @property {string | null} caption
 * @property {Record<string, string | number | boolean>} args
 * @property {Record<string, string | number | boolean>} globals
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
        typeof panel.story === "string" && panel.story.length > 0,
        `${at}.story is required (a Storybook story id, e.g. form-controls-rating--default)`,
      );
      check(
        panel.caption === undefined || typeof panel.caption === "string",
        `${at}.caption must be a string when given`,
      );

      const expect = panel.expect ?? [];
      check(Array.isArray(expect), `${at}.expect must be an array`);
      // A panel that drives args MUST assert what it rendered: Storybook
      // filters `args=` down to the story's declared `argTypes` and drops the
      // rest without a word, so the URL is evidence of nothing (#3030).
      check(
        Object.keys(panel.args ?? {}).length === 0 || expect.length > 0,
        `${at} sets args but asserts nothing — add ${at}.expect, or Storybook may drop the args and the capture shows the default state`,
      );
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

      // Encode eagerly: an unusable arg is a spec bug and should surface before
      // a browser starts, not as a capture that merely looks default.
      if (panel.args) encodeStorybookParam(panel.args);
      if (panel.globals) encodeStorybookParam(panel.globals);

      return {
        story: panel.story,
        caption: panel.caption ?? null,
        args: panel.args ?? {},
        globals: panel.globals ?? {},
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
 * Story ids the running Storybook does not know, each with the closest ids it
 * does — a typo in a story id otherwise ends as a blank panel.
 *
 * @param {{ entries?: Record<string, { id: string; type?: string }> }} index
 *   Storybook's `/index.json`
 * @param {string[]} ids
 * @returns {{ id: string; suggestions: string[] }[]}
 */
export const findUnknownStories = (index, ids) => {
  const known = Object.values(index.entries ?? {})
    .filter((entry) => (entry.type ?? "story") === "story")
    .map((entry) => entry.id);
  const knownSet = new Set(known);
  return ids
    .filter((id) => !knownSet.has(id))
    .map((id) => {
      const [component, story] = id.split("--");
      const suggestions = known
        .filter(
          (candidate) =>
            candidate.startsWith(`${component}--`) ||
            (story !== undefined && candidate.endsWith(`--${story}`)),
        )
        .slice(0, 8);
      return { id, suggestions };
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
 * measure and to assert it. The page is therefore served on the Storybook
 * origin (the runner fulfils a route there), never from `file://`.
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
  iframe { display: block; width: 100%; border: 0; }
</style></head>
<body><div id="figure">${body}</div></body></html>`;
};
