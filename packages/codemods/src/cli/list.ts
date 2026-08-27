import colors from "picocolors";
import { valid } from "semver";
import type { CatalogEntry } from "../catalog/entries.js";
import { selectEntries, sortBySince } from "../catalog/select.js";

export interface RenderListInput {
  entries: CatalogEntry[];
  /** Both bounds are optional. Without them the whole catalogue is listed. */
  from?: string;
  to?: string;
  json: boolean;
  /** Emit ANSI colour. Off by default so a test sees plain text. */
  color?: boolean;
  /** Terminal width to wrap prose to. */
  width?: number;
}

/**
 * `--from`/`--to` errors, for the caller to check before rendering anything.
 *
 * `list` is the read-only planning entry point, and an exact published version
 * is the only thing `selectEntries` accepts for a bound — unlike `upgrade`'s
 * revision, it takes no keyword, dist-tag, or range. Without this check, an
 * invalid bound reaches `semver`'s `lt`/`lte` inside `selectEntries` and throws
 * node-semver's own "Invalid Version: …", which names neither flag nor what is
 * accepted. Matches the tone of `upgrade`'s own unresolvable- revision
 * message.
 */
export const validateListBounds = ({
  from,
  to,
}: Pick<RenderListInput, "from" | "to">): string | undefined => {
  const invalid = [from, to].filter(
    (bound): bound is string => bound !== undefined && valid(bound) === null,
  );

  if (invalid.length === 0) {
    return undefined;
  }

  const bounds = invalid.map((bound) => `"${bound}"`).join(" and ");
  const verb = invalid.length > 1 ? "are" : "is";
  return `${bounds} ${verb} not a published version. --from and --to take an exact version, e.g. 1.4.0 — not a range or a dist-tag.`;
};

/**
 * What the reader has to do, and the colour that says it at a glance.
 *
 * `plural` only differs for `codemod`, which is a countable thing; "by hand"
 * and "no code change" describe how, not how many.
 */
const actions: Record<
  CatalogEntry["action"],
  { label: string; plural: string; paint: (text: string) => string }
> = {
  codemod: { label: "codemod", plural: "codemods", paint: colors.green },
  manual: { label: "by hand", plural: "by hand", paint: colors.yellow },
  none: {
    label: "no code change",
    plural: "no code change",
    paint: colors.blue,
  },
};

/**
 * ANSI escapes have no width; measuring must ignore them.
 *
 * Built from a char code rather than written as a literal, so no control
 * character sits in the source — which is also what `no-control-regex` wants.
 */
const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
export const stripAnsi = (text: string): string => text.replace(ansi, "");
const visibleWidth = (text: string): number => stripAnsi(text).length;

/**
 * Wraps to `width`, measuring visible width so already-coloured text still
 * breaks in the right place.
 *
 * Exported so `detect` and `verify` (see `cli/detect.ts`, `cli/verify.ts`) wrap
 * their own findings and hints the same way, instead of a second implementation
 * drifting from this one.
 */
export const wrap = (text: string, width: number): string[] => {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/).filter((part) => part !== "")) {
    if (line === "") {
      line = word;
    } else if (visibleWidth(line) + 1 + visibleWidth(word) <= width) {
      line = `${line} ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line !== "") {
    lines.push(line);
  }

  return lines.length > 0 ? lines : [""];
};

/**
 * Renders `code` spans as colour instead of literal backticks.
 *
 * The catalogue bodies are Markdown, so its prose fields carry backticks. In a
 * terminal those are noise, but the emphasis they mark is exactly what a reader
 * scans for — a symbol name or a command.
 */
export const inlineCode = (text: string, paint: Painter): string =>
  text.replace(/`([^`]+)`/g, (_, code: string) => paint.code(code));

export interface Painter {
  bold: (text: string) => string;
  dim: (text: string) => string;
  code: (text: string) => string;
}

/** Shared with `detect` and `verify` so all three commands paint the same way. */
export const painter = (color: boolean): Painter =>
  color
    ? { bold: colors.bold, dim: colors.dim, code: colors.cyan }
    : { bold: (text) => text, dim: (text) => text, code: (text) => text };

export const indent = "  ";
const labelWidth = 8;

/** One `apply` / `verify` / `detect` row: dim label, wrapped body beside it. */
export const field = (
  label: string,
  value: string,
  width: number,
  paint: Painter,
): string[] => {
  const gutter = indent + " ".repeat(labelWidth);
  const body = wrap(
    inlineCode(value, paint),
    Math.max(width - gutter.length, 20),
  );

  return body.map((line, index) =>
    index === 0
      ? `${indent}${paint.dim(label.padEnd(labelWidth))}${line}`
      : `${gutter}${line}`,
  );
};

const renderEntry = (
  entry: CatalogEntry,
  width: number,
  color: boolean,
): string => {
  const paint = painter(color);
  const action = actions[entry.action];
  const mark = color ? action.paint("\u25CF") : "*";

  const meta = [entry.kind, action.label];
  if (entry.remotePackage) {
    meta.push("also in flow-remote-react-components");
  }

  const lines = [
    `${mark} ${paint.bold(entry.id)}  ${paint.dim(entry.since)}`,
    indent + paint.dim(meta.join(" \u00B7 ")),
    "",
    ...field("apply", entry.apply, width, paint),
  ];

  if (entry.action === "codemod") {
    lines.push(
      "",
      `${indent}${paint.dim("$")} ${paint.code(
        `npx @mittwald/flow-codemods@latest ${entry.id} src`,
      )}`,
    );
  }

  return lines.join("\n");
};

/** "4 migrations from X to Y" plus a count per action. */
const renderHeader = (
  selected: CatalogEntry[],
  { from, to }: Pick<RenderListInput, "from" | "to">,
  color: boolean,
): string => {
  const paint = painter(color);
  const range = [
    from === undefined ? undefined : `from ${from}`,
    to === undefined ? undefined : `to ${to}`,
  ]
    .filter((part) => part !== undefined)
    .join(" ");

  const noun = selected.length === 1 ? "migration" : "migrations";
  const counts = (Object.keys(actions) as CatalogEntry["action"][])
    .map((action) => ({
      action,
      count: selected.filter((entry) => entry.action === action).length,
    }))
    .filter(({ count }) => count > 0)
    .map(({ action, count }) => {
      const { label, plural, paint } = actions[action];
      const text = `${count} ${count === 1 ? label : plural}`;
      return color ? paint(text) : text;
    });

  // The counts carry their own colour, so no dim around them — nesting the two
  // makes both weaker.
  return [
    `${paint.bold(`${selected.length} ${noun}`)}${range === "" ? "" : ` ${range}`}`,
    counts.join(paint.dim(" \u00B7 ")),
    "",
  ].join("\n");
};

/**
 * The migrations for a version range, as text or JSON.
 *
 * Read-only by design: this is what an agent can call to plan before it changes
 * anything. `--json` carries `apply`, `verify` and `detect` through unchanged,
 * because those are the fields it acts on — and it returns before any styling,
 * so no escape sequence can ever reach a parser.
 *
 * `color` and `width` are arguments rather than read from the environment here,
 * so the rendering is deterministic in a test. `cli.ts` supplies them.
 */
export const renderList = ({
  entries,
  from,
  to,
  json,
  color = false,
  width = 80,
}: RenderListInput): string => {
  // The two paths differ in more than their bounds, deliberately: `sortBySince`
  // keeps `kind: "tool"` entries, `selectEntries` drops them. Unbounded, this is
  // a catalogue browser, and browsing is how someone finds the codemod that
  // ports an app between packages. Bounded, it answers "what does this version
  // range require of me" — and a port is never required by a version range. Do
  // not unify these.
  //
  // `0.0.0-0` rather than `0.0.0` as the lower sentinel: the gate's
  // `current < since` is strict, so `0.0.0` would hide an entry whose `since` is
  // exactly `0.0.0`. A prerelease of `0` sorts below every published version.
  // (`0.0.0-0.0` is lower still; nothing publishes that.)
  const selected =
    from === undefined && to === undefined
      ? sortBySince(entries)
      : selectEntries(entries, from ?? "0.0.0-0", to ?? "9999.0.0");

  if (json) {
    return JSON.stringify(selected, null, 2);
  }

  if (selected.length === 0) {
    return "Nothing to migrate in that range.\n";
  }

  const body = selected
    .map((entry) => renderEntry(entry, width, color))
    .join("\n\n");

  return `${renderHeader(selected, { from, to }, color)}\n${body}\n`;
};
