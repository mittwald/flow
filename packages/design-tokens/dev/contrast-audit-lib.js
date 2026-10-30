// @ts-check

/**
 * WCAG 2.2 contrast audit over the built token tree (`dist/json-runtime`).
 *
 * Pairs are derived from token names, never from file paths: a content token
 * pairs with the background token whose name swaps the content part for
 * `background-color` (`primary-solid-content-color` →
 * `primary-solid-background-color`, `tooltip.color` →
 * `tooltip.background-color`). A name without such a sibling yields no pair.
 *
 * Content colors without a background sibling (`text`, `heading`, `link`,
 * `icon`, borders, focus ring, …) are listed in `SURFACE_CONTENT` and rated
 * against every background they render on (`CONTENT_SURFACES`).
 */

/** @typedef {{ r: number; g: number; b: number; a: number }} Rgba */

/**
 * @typedef {object} Pair
 * @property {string} name Content token without its state
 * @property {string} state `default`, `hover`, … or `-` for a stateless pair
 * @property {string} content Full content token key
 * @property {string} background Full background token key
 * @property {"text" | "ui"} kind Text needs 4.5:1, icons and handles 3:1
 * @property {Backdrop} backdrop What a translucent background sits on
 * @property {boolean} exempt Disabled controls are exempt (WCAG 1.4.3)
 * @property {"pair" | "surface"} source Found by name (`findPairs`) or listed
 *   in `SURFACE_CONTENT` (`findSurfaceChecks`)
 */

/** @typedef {"surface" | "inverse-surface" | "white" | "black"} Backdrop */

/**
 * @typedef {Pair & {
 *   theme: string;
 *   ratio: number | null;
 *   required: number;
 *   status: Status;
 *   colors?: { content: string; background: string };
 * }} Result
 */

/** @typedef {"pass" | "large-only" | "fail" | "exempt" | "unresolvable"} Status */

export const AA_TEXT = 4.5;
export const AA_LARGE_AND_UI = 3;

/**
 * The theme's raised surface and its inverse, the strongest content tone
 * (near-black in light, white in dark). Translucent backgrounds are composited
 * on these.
 */
export const SURFACE_TOKEN = "elevation.color.100";
export const INVERSE_SURFACE_TOKEN = "content.color.300";

const STATES = new Set([
  "default",
  "hover",
  "pressed",
  "disabled",
  "selected",
  "current",
  "focused",
  "invalid",
  "target",
  "error",
]);

/**
 * @param {unknown} tree Json-runtime tree (`{ value, path }` leaves)
 * @returns {Map<string, string>} Token key (`a.b.c`) → value
 */
export function flattenTokens(tree) {
  /** @type {Map<string, string>} */
  const tokens = new Map();
  /** @param {any} node */
  const walk = (node) => {
    for (const child of Object.values(node)) {
      if (child && Array.isArray(child.path) && "value" in child) {
        tokens.set(child.path.join("."), String(child.value));
      } else if (child && typeof child === "object") {
        walk(child);
      }
    }
  };
  walk(tree);
  return tokens;
}

/**
 * @param {string} value `transparent`, `#rgb`, `#rrggbb(aa)`, `rgb()`/`rgba()`
 * @returns {Rgba | null} Null for anything else (gradients, `var()`)
 */
export function parseColor(value) {
  const v = value.trim().toLowerCase();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(v)?.[1];
  if (hex) {
    const full = (
      hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex
    ).padEnd(8, "f");
    const n = (/** @type {number} */ i) =>
      parseInt(full.slice(i * 2, i * 2 + 2), 16);
    return { r: n(0), g: n(1), b: n(2), a: n(3) / 255 };
  }

  const fn = /^rgba?\(([^)]*)\)$/.exec(v)?.[1];
  if (fn) {
    const parts = fn
      .replace("/", " ")
      .split(/[\s,]+/)
      .filter(Boolean);
    if (parts.length !== 3 && parts.length !== 4) return null;
    const channel = (/** @type {string} */ p) =>
      p.endsWith("%") ? (parseFloat(p) / 100) * 255 : parseFloat(p);
    const alpha = (/** @type {string | undefined} */ p) =>
      p === undefined
        ? 1
        : p.endsWith("%")
          ? parseFloat(p) / 100
          : parseFloat(p);
    const [r, g, b, a] = [
      channel(parts[0]),
      channel(parts[1]),
      channel(parts[2]),
      alpha(parts[3]),
    ];
    return [r, g, b, a].some(Number.isNaN) ? null : { r, g, b, a };
  }

  return null;
}

/**
 * Source-over compositing of `top` on an opaque `bottom`.
 *
 * @param {Rgba} top
 * @param {Rgba} bottom
 * @returns {Rgba}
 */
export function composite(top, bottom) {
  const mix = (/** @type {"r" | "g" | "b"} */ c) =>
    top[c] * top.a + bottom[c] * (1 - top.a);
  return { r: mix("r"), g: mix("g"), b: mix("b"), a: 1 };
}

/**
 * WCAG 2.2 relative luminance.
 *
 * @param {Rgba} color Opaque
 */
export function relativeLuminance({ r, g, b }) {
  const lin = (/** @type {number} */ c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * @param {Rgba} a Opaque
 * @param {Rgba} b Opaque
 */
export function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

/** @param {Rgba} c */
export function toHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/**
 * Splits a key into its name and an optional trailing state segment.
 *
 * @param {string} key
 */
function splitState(key) {
  const i = key.lastIndexOf(".");
  const last = key.slice(i + 1);
  return i > 0 && STATES.has(last)
    ? { name: key.slice(0, i), state: last }
    : { name: key, state: undefined };
}

/**
 * Maps a content token name to the name its background would have, or null when
 * the name is no content color. Only the last segment is rewritten.
 *
 * @param {string} name
 */
export function backgroundNameFor(name) {
  const i = name.lastIndexOf(".");
  const head = name.slice(0, i + 1);
  const segment = name.slice(i + 1);
  if (/background|border/.test(segment)) return null;
  const match = /^(.*?)(content-accent-|content-|icon-)?color(-.+)?$/.exec(
    segment,
  );
  if (!match) return null;
  const [, prefix, , suffix = ""] = match;
  return `${head}${prefix}background-color${suffix}`;
}

/**
 * The surface a pair is designed for, from its `dark`/`light`(`-static`) name
 * part. `light` content (white in the light theme) sits on dark surfaces,
 * `*-static` on fixed black or white. Real backdrops (images, colored boxes)
 * are unknown, so these are ideal ones.
 *
 * @param {string} name
 * @returns {Backdrop}
 */
export function backdropFor(name) {
  const context =
    /(?:^|[-.])(dark-static|light-static|dark|light)(?=[-.]|$)/.exec(name)?.[1];
  switch (context) {
    case "light":
      return "inverse-surface";
    case "dark-static":
      return "white";
    case "light-static":
      return "black";
    default:
      return "surface";
  }
}

/**
 * Every content/background pair the token names declare, one per state.
 *
 * @param {Iterable<string>} keys
 * @returns {Pair[]}
 */
export function findPairs(keys) {
  /** @type {Map<string, Map<string | undefined, string>>} */
  const byName = new Map();
  for (const key of keys) {
    const { name, state } = splitState(key);
    if (!byName.has(name)) byName.set(name, new Map());
    byName.get(name)?.set(state, key);
  }

  /** @type {Pair[]} */
  const pairs = [];
  for (const [name, contentStates] of byName) {
    const backgroundName = backgroundNameFor(name);
    const backgroundStates = backgroundName && byName.get(backgroundName);
    if (!backgroundStates) continue;

    const states = new Set([
      ...contentStates.keys(),
      ...backgroundStates.keys(),
    ]);
    // A stateless side pairs with every state of the other side.
    if (states.size > 1) states.delete(undefined);

    for (const state of states) {
      const content =
        contentStates.get(state) ??
        contentStates.get("default") ??
        contentStates.get(undefined);
      const background =
        backgroundStates.get(state) ??
        backgroundStates.get("default") ??
        backgroundStates.get(undefined);
      if (!content || !background) continue;
      pairs.push({
        name,
        state: state ?? "-",
        content,
        background,
        kind: /icon|checkbox|handle/.test(name) ? "ui" : "text",
        backdrop: backdropFor(name),
        exempt: state === "disabled" || /disabled/.test(name),
        source: "pair",
      });
    }
  }
  return pairs;
}

/**
 * Backgrounds that take arbitrary content — Text, Heading, Link, Icon,
 * AlertText, Alert, form fields. Each is set by the named component's
 * `.module.scss`. The page background belongs to the app: Storybook paints it
 * white (`elevation.color.100`), the docs and their previews
 * `elevation.color.200` (`apps/docs/src/app/layout.module.scss`). `*` matches
 * within one segment, a leading `!` excludes.
 */
export const CONTENT_SURFACES = [
  "elevation.color.100", // page (Storybook), Section without a card
  "elevation.color.200", // page (docs)
  "layout-card.background-color", // LayoutCard
  "modal.background-color", // Modal
  "modal.footer-background-color", // Modal footer
  "popover.background-color", // Popover, ContextualHelp, CoachMark
  "table.background-color", // Table
  "table.background-color-accent", // Table, striped rows
  "accent-box.background-color-*", // AccentBox
  "!accent-box.background-color-gradient*", // no plain color (#3456)
  "message.background-color-*", // Message, responder and sender
  "list-item.background-color.default", // ListItem
  "file-card.background-color.default", // FileCard
  "file-card.background-color.error",
  "notification.*-background-color.default", // Notification
  "alert.*-background-color", // Alert
];

/**
 * Hover and pressed backgrounds of clickable containers. Their own content
 * (text, headings, icons) sits on them; form fields and the focus ring do not —
 * a focused child draws its ring while the container is at rest.
 */
export const STATE_SURFACES = [
  "list-item.background-color.hover", // ListItem
  "list-item.background-color.pressed",
  "file-card.background-color.hover", // FileCard
  "file-card.background-color.pressed",
  "accordion.background-color.hover", // Accordion header
  "accordion.background-color.pressed",
  "notification.*-background-color.hover", // Notification
  "notification.*-background-color.pressed",
];

/**
 * Content colors without a background sibling. `on` lists the backgrounds; `$1`
 * there repeats the first `*` of the matched content token. Names with a
 * `dark`/`light`(`-static`) context are rated on their ideal backdrop only (see
 * `backdropFor`) — authors place them on images or colored boxes Flow does not
 * know.
 *
 * Borders count only where WCAG 1.4.11 asks for 3:1: where the border alone
 * shows the extent or state of a control (form fields, checkbox and radio,
 * slider track, focus ring). Borders that group content (LayoutCard, Modal,
 * Popover, Table, Separator, ListItem, Accordion) or repeat what an icon or
 * label says (Alert, Notification, Badge, outline Button, FileDropZone) are not
 * rated.
 *
 * @type {{ tokens: string[]; kind: "text" | "ui"; on: string[] }[]}
 */
export const SURFACE_CONTENT = [
  {
    // Inline content, also inside ListItem, FileCard, Accordion, Notification
    kind: "text",
    tokens: [
      "text.color.*",
      "heading.color*",
      "link.color*.*",
      "alert-text.*-color",
      "kbd.content-color-plain.*",
    ],
    on: [...CONTENT_SURFACES, ...STATE_SURFACES],
  },
  {
    kind: "ui",
    tokens: ["icon.*color", "loading-spinner.color*"],
    on: [...CONTENT_SURFACES, ...STATE_SURFACES],
  },
  {
    // Blocks and form parts that clickable containers do not hold
    kind: "text",
    tokens: [
      "label.color.*",
      "breadcrumb.color*.*",
      "illustrated-message.*content-color",
    ],
    on: CONTENT_SURFACES,
  },
  {
    kind: "ui",
    tokens: [
      "focus.outline-color",
      "form-control.border-color.*",
      "choice.icon-color.*",
      "slider.track-border-color.*",
    ],
    on: CONTENT_SURFACES,
  },
  {
    kind: "text",
    tokens: ["notification.*-heading-color"],
    on: ["notification.$1-background-color.*"],
  },
  {
    kind: "text",
    tokens: ["alert.*-heading-color"],
    on: ["alert.$1-background-color"],
  },
  {
    kind: "text",
    tokens: ["form-control.placeholder-color.*"],
    // `selected` marks a chosen value, so no placeholder shows
    on: [
      "form-control.background-color.*",
      "!form-control.background-color.selected",
    ],
  },
];

/**
 * @param {string} glob `*` matches within one segment
 * @returns {RegExp} One capture group per `*`
 */
function globToRegExp(glob) {
  const escaped = glob.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("*", "([^.]*)")}$`);
}

/**
 * @param {string[]} keys
 * @param {string[]} globs Leading `!` excludes
 */
function expandGlobs(keys, globs) {
  const include = globs.filter((g) => !g.startsWith("!")).map(globToRegExp);
  const exclude = globs
    .filter((g) => g.startsWith("!"))
    .map((g) => globToRegExp(g.slice(1)));
  return keys.filter(
    (key) =>
      include.some((r) => r.test(key)) && !exclude.some((r) => r.test(key)),
  );
}

/**
 * Every content color from `SURFACE_CONTENT` on every background it renders on.
 *
 * @param {Iterable<string>} keys
 * @returns {Pair[]}
 */
export function findSurfaceChecks(keys) {
  const all = [...keys];

  /** @type {Pair[]} */
  const checks = [];
  for (const { tokens, kind, on } of SURFACE_CONTENT) {
    for (const glob of tokens) {
      const regExp = globToRegExp(glob);
      for (const content of all.filter((key) => regExp.test(key))) {
        const { name, state } = splitState(content);
        const backdrop = backdropFor(name);
        const contextual = /(?:^|[-.])(dark|light)(?:-static)?(?=[-.]|$)/.test(
          name,
        );
        const captured = regExp.exec(content)?.[1] ?? "";
        const backgrounds = contextual
          ? [null]
          : expandGlobs(
              all,
              on.map((g) => g.replaceAll("$1", captured)),
            );
        for (const background of backgrounds) {
          checks.push({
            name,
            state: state ?? "-",
            content,
            background: background ?? `(${backdrop})`,
            kind,
            backdrop,
            exempt: /disabled/.test(`${content} ${background ?? ""}`),
            source: "surface",
          });
        }
      }
    }
  }
  return checks;
}

/** @type {Record<Exclude<Backdrop, "surface" | "inverse-surface">, Rgba>} */
const FIXED_BACKDROPS = {
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
};

/**
 * Resolves and rates every pair in one theme.
 *
 * @param {Map<string, string>} tokens Flattened theme tokens
 * @param {string} theme Label only
 * @returns {Result[]}
 */
export function auditTheme(tokens, theme) {
  /** @param {string} key */
  const opaque = (key) => {
    const value = tokens.get(key);
    const color = value === undefined ? null : parseColor(value);
    if (!color || color.a !== 1) {
      throw new Error(
        `${theme}: backdrop token "${key}" must be an opaque color, got "${value}"`,
      );
    }
    return color;
  };
  /** @type {Record<Backdrop, Rgba>} */
  const backdrops = {
    surface: opaque(SURFACE_TOKEN),
    "inverse-surface": opaque(INVERSE_SURFACE_TOKEN),
    ...FIXED_BACKDROPS,
  };

  return [...findPairs(tokens.keys()), ...findSurfaceChecks(tokens.keys())].map(
    (pair) => {
      const required = pair.kind === "ui" ? AA_LARGE_AND_UI : AA_TEXT;
      const content = parseColor(tokens.get(pair.content) ?? "");
      // A backdrop-only check names its backdrop in parentheses.
      const background = pair.background.startsWith("(")
        ? { r: 0, g: 0, b: 0, a: 0 }
        : parseColor(tokens.get(pair.background) ?? "");
      if (!content || !background) {
        return {
          ...pair,
          theme,
          ratio: null,
          required,
          status: "unresolvable",
        };
      }
      const flatBackground = composite(background, backdrops[pair.backdrop]);
      const flatContent = composite(content, flatBackground);
      const ratio = contrastRatio(flatContent, flatBackground);
      /** @type {Status} */
      const status = pair.exempt
        ? "exempt"
        : ratio >= required
          ? "pass"
          : pair.kind === "text" && ratio >= AA_LARGE_AND_UI
            ? "large-only"
            : "fail";
      return {
        ...pair,
        theme,
        ratio,
        required,
        status,
        colors: {
          content: toHex(flatContent),
          background: toHex(flatBackground),
        },
      };
    },
  );
}

/**
 * Known failures the gate tolerates. Keys: `<theme> <content> on <background>`
 * (a backdrop-only check names its backdrop in parentheses). Values: the ratio
 * the pair may not drop below.
 *
 * @typedef {{ reason: string; pairs: Record<string, number> }[]} Allowlist
 */

/** @param {Pick<Result, "theme" | "content" | "background">} r */
export function allowlistKey({ theme, content, background }) {
  return `${theme} ${content} on ${background}`;
}

/** Floors a ratio to the two decimals the allowlist records. */
export function floorRatio(/** @type {number} */ ratio) {
  return Math.floor(ratio * 100) / 100;
}

/**
 * Checks results against the allowlist for `--strict`.
 *
 * - `unlisted`: fails or is `large-only` and is not allowlisted — a regression
 * - `worse`: allowlisted, but below its recorded ratio
 * - `stale`: allowlisted, but no longer failing (fixed or renamed) — remove it
 *
 * @param {Result[]} results
 * @param {Allowlist} allowlist
 */
export function checkAllowlist(results, allowlist) {
  /** @type {Map<string, { floor: number; reason: string }>} */
  const allowed = new Map();
  for (const { reason, pairs } of allowlist) {
    for (const [key, floor] of Object.entries(pairs)) {
      if (allowed.has(key)) throw new Error(`Allowlisted twice: ${key}`);
      allowed.set(key, { floor, reason });
    }
  }

  const failing = results.filter(
    (r) => r.status === "fail" || r.status === "large-only",
  );
  const failingKeys = new Set(failing.map(allowlistKey));
  /** @type {Result[]} */
  const unlisted = [];
  /** @type {(Result & { floor: number })[]} */
  const worse = [];
  for (const r of failing) {
    const entry = allowed.get(allowlistKey(r));
    if (!entry) unlisted.push(r);
    else if (r.ratio !== null && floorRatio(r.ratio) < entry.floor) {
      worse.push({ ...r, floor: entry.floor });
    }
  }
  const stale = [...allowed.keys()].filter((key) => !failingKeys.has(key));
  return { allowed, unlisted, worse, stale };
}
