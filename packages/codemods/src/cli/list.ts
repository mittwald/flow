import colors from "picocolors";
import { lte } from "semver";
import { allEntries, type CatalogEntry } from "../catalog/entries.js";
import { selectEntries, sortBySince } from "../catalog/select.js";
import {
  defaultRangeDeps,
  resolveRange,
  type RangeDeps,
} from "../resolve/range.js";
import type { ParsedCommand } from "./args.js";

export interface RenderListInput {
  entries: CatalogEntry[];
  /**
   * The version range to show migrations for. Both bounds always arrive
   * together — there is no partial range — so omitting it entirely is what
   * lists the whole catalogue.
   */
  range?: { from: string; to: string };
  json: boolean;
  /** Emit ANSI colour. Off by default so a test sees plain text. */
  color?: boolean;
  /** Terminal width to wrap prose to. */
  width?: number;
  /**
   * The path argument to print in each codemod entry's runnable command.
   *
   * Defaults to `src` — the same default `resolveSourcePath` applies — but a
   * caller that knows better must say so, or the printed command sends the
   * reader at a directory their project does not have. See
   * `displaySourcePath`.
   */
  path?: string;
  /**
   * Render the frame around the entries: the context on top (the range, the
   * catch-up legend) and the summary at the bottom (the counts). On by default.
   * `upgrade` turns it off for its by-hand section: it already printed its own
   * heading and its own aggregate ("N codemods run, N changed something"), and
   * this renderer's frame would just repeat both — see `runUpgrade`. Named for
   * the whole frame, not just the top half, since it now gates both. The
   * per-entry catch-up mark itself is unaffected — it lives in the body, not
   * the frame.
   */
  frame?: boolean;
}

/** A palette key from `painter()` — see the `tone` field on `actions` below. */
type Tone = "green" | "yellow" | "blue";

/**
 * What the reader has to do, and the colour that says it at a glance.
 *
 * `plural` only differs for `codemod`, which is a countable thing; "by hand"
 * and "no code change" describe how, not how many. `tone` names a key into the
 * `Painter` a call site already built with `painter(color)` — not a bound
 * colour function — so which palette applies is decided once, by the `color`
 * argument, not baked into this module-level table. See `painter` for why.
 */
const actions: Record<
  CatalogEntry["action"],
  { label: string; plural: string; tone: Tone }
> = {
  codemod: { label: "codemod", plural: "codemods", tone: "green" },
  manual: { label: "by hand", plural: "by hand", tone: "yellow" },
  none: {
    label: "no code change",
    plural: "no code change",
    tone: "blue",
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
 */
const wrap = (text: string, width: number): string[] => {
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
const inlineCode = (text: string, paint: Painter): string =>
  text.replace(/`([^`]+)`/g, (_, code: string) => paint.code(code));

interface Painter extends Record<Tone, (text: string) => string> {
  bold: (text: string) => string;
  dim: (text: string) => string;
  code: (text: string) => string;
}

/**
 * Builds a palette from `color`, and only from `color`.
 *
 * `colors` (the module-level `picocolors` default export) auto-detects a TTY
 * and disables itself under one — reading `colors.green` etc. directly would
 * make the _environment_, not this argument, the real decider, silently
 * disagreeing with `cli.ts`'s own TTY/`NO_COLOR`/`--json` check. `createColors`
 * returns a palette with colour forced on or off, so `color` is the only input
 * to how this renders.
 */
const painter = (color: boolean): Painter => {
  const palette = colors.createColors(color);
  return {
    bold: palette.bold,
    dim: palette.dim,
    code: palette.cyan,
    green: palette.green,
    yellow: palette.yellow,
    blue: palette.blue,
  };
};

const indent = "  ";
const labelWidth = 8;

/** One `apply` row: dim label, wrapped body beside it. */
const field = (
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

/**
 * Whether `entry` shipped at or before `current` \u2014 selected because the
 * gate no longer has a lower bound (`since <= target` alone, see
 * `selectEntries`), not because the range newly crosses it. Only meaningful for
 * a range-bounded list \u2014 the whole-catalogue browse has no `current` to
 * compare against.
 *
 * This is what may already be done, not what is done: nothing records which
 * migrations a project has actually performed, codemod or manual alike \u2014
 * see `selectEntries`.
 */
const isCatchUp = (entry: CatalogEntry, current: string | undefined): boolean =>
  current !== undefined && lte(entry.since, current);

const renderEntry = (
  entry: CatalogEntry,
  width: number,
  color: boolean,
  catchUp: boolean,
  path: string,
): string => {
  const paint = painter(color);
  const action = actions[entry.action];
  // Hollow vs filled: catch-up shipped at or before `current`, so it may
  // already be handled, unlike something the upgrade is newly bringing in \u2014
  // see the legend line in `renderContext`.
  const symbol = catchUp ? "\u25CB" : "\u25CF";
  const mark = color ? paint[action.tone](symbol) : catchUp ? "o" : "*";

  const meta = [entry.kind, action.label];
  if (entry.remotePackage) {
    meta.push("also in flow-remote-react-components");
  }
  if (catchUp) {
    meta.push("catch-up");
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
        `npx @mittwald/flow-codemods@latest ${entry.id} ${path}`,
      )}`,
    );
  }

  return lines.join("\n");
};

/**
 * What a reader needs _before_ the entries: what range this is, and — when it
 * explains a mark they're about to see below — the catch-up legend.
 *
 * "" for a bare `list` (no range): there is nothing to decode, so nothing
 * renders. Otherwise "from X to Y", or for a zero-width range "nothing newer
 * than X" (`from`/`to` is the wrong form once they're equal — that isn't a
 * range, it's "you're already there"), plus — when any entry below is marked
 * catch-up — the legend for the mark. The gate has no lower bound (see
 * `selectEntries`), so a range-bounded list can show every entry in the
 * catalogue, not just the ones the range newly crosses; the legend says what
 * the mark means — and, just as much, what it does not: catch-up is "may
 * already be done", never "already done".
 */
const renderContext = (
  selected: CatalogEntry[],
  range: RenderListInput["range"],
  color: boolean,
  width: number,
): string => {
  if (range === undefined) {
    return "";
  }

  const catchUpCount = selected.filter((entry) =>
    isCatchUp(entry, range.from),
  ).length;

  const rangeText =
    range.from === range.to
      ? catchUpCount > 0
        ? `nothing newer than ${range.to}; entries below are catch-up`
        : `nothing newer than ${range.to}`
      : `from ${range.from} to ${range.to}`;

  if (catchUpCount === 0) {
    return rangeText;
  }

  const paint = painter(color);
  const mark = color ? paint[actions.codemod.tone]("○") : "o";
  // Wrapped like every other line: unwrapped it ran to 150 characters and broke
  // hard in any terminal narrower than that.
  const legendGutter = "   ";
  const legend = wrap(
    `catch-up: shipped at or before ${range.from} — you may already have done this. Re-running a codemod is a safe no-op; a manual step needs your own check.`,
    Math.max(width - legendGutter.length, 20),
  ).map((line, index) =>
    index === 0 ? `${mark}  ${line}` : `${legendGutter}${line}`,
  );

  return [rangeText, ...legend].join("\n");
};

/**
 * What the reader has, after reading the entries: "N migrations · N codemods ·
 * N by hand · N no code change".
 *
 * Nothing is hidden any more (see `selectEntries`), so this is just the entry
 * count and the per-action breakdown — no separate hidden-count line.
 */
const renderSummary = (selected: CatalogEntry[], color: boolean): string => {
  const paint = painter(color);

  const noun = selected.length === 1 ? "migration" : "migrations";
  const counts = (Object.keys(actions) as CatalogEntry["action"][])
    .map((action) => ({
      action,
      count: selected.filter((entry) => entry.action === action).length,
    }))
    .filter(({ count }) => count > 0)
    .map(({ action, count }) => {
      const { label, plural, tone } = actions[action];
      const text = `${count} ${count === 1 ? label : plural}`;
      return color ? paint[tone](text) : text;
    });

  // The counts carry their own colour, so no dim around them — nesting the two
  // makes both weaker.
  return [paint.bold(`${selected.length} ${noun}`), ...counts].join(
    paint.dim(" · "),
  );
};

/**
 * The migrations for a version range, as text or JSON.
 *
 * Read-only by design: this is what an agent can call to plan before it changes
 * anything. `--json` carries `apply` through unchanged, because that is the
 * field it acts on — and it returns before any styling, so no escape sequence
 * can ever reach a parser.
 *
 * `color` and `width` are arguments rather than read from the environment here,
 * so the rendering is deterministic in a test — `painter` builds its palette
 * from `color` alone, never from the terminal. `cli.ts` supplies them.
 */
export const renderList = ({
  entries,
  range,
  json,
  color = false,
  width = 80,
  path = "src",
  frame = true,
}: RenderListInput): string => {
  // The two paths differ in their bounds, deliberately: unbounded, this is a
  // plain catalogue browse — every entry, sorted, regardless of whether it
  // would apply to any given range. Bounded, it answers "what does this
  // version range require of me", which `selectEntries` computes per entry
  // from `since`. `range`'s two fields always arrive together (there is no
  // partial bound any more — see `resolveRange`), so there is no sentinel to
  // fill a missing side with; the branch below is the only thing that decides
  // "whole catalogue" vs. "this range".
  const selected =
    range === undefined
      ? sortBySince(entries)
      : selectEntries(entries, range.to);

  if (json) {
    // An object, not the bare array: the agent-facing form has to say which
    // range it describes, or `list minor` and `list` are indistinguishable in
    // it — and it carries `catchUp` per entry for the same reason the human
    // form marks it.
    return `${JSON.stringify(
      {
        range:
          range === undefined
            ? null
            : { current: range.from, target: range.to },
        migrations: selected.map((entry) => ({
          ...entry,
          catchUp: isCatchUp(entry, range?.from),
        })),
      },
      null,
      2,
    )}\n`;
  }

  if (selected.length === 0) {
    return "Nothing to migrate in that range.\n";
  }

  const body = selected
    .map((entry) =>
      renderEntry(entry, width, color, isCatchUp(entry, range?.from), path),
    )
    .join("\n\n");

  if (!frame) {
    return `${body}\n`;
  }

  // Context (range, legend) leads, because a reader needs both before the
  // entries; the summary (counts) trails, because a 22-entry list scrolls the
  // top out of sight well before the reader reaches the end — exactly when
  // they want the counts. `context` is "" for a bare `list`, so no blank line
  // gets left dangling above the first entry.
  const context = renderContext(selected, range, color, width);
  const summary = renderSummary(selected, color);

  return `${context === "" ? "" : `${context}\n\n`}${body}\n\n${summary}\n`;
};

export interface ListDeps extends RangeDeps {
  /**
   * Raw output writer — matches `process.stdout.write`'s own contract: no
   * newline is appended automatically.
   */
  write: (text: string) => void;
  color?: boolean;
  width?: number;
  /** Printed in each codemod entry's command — see `RenderListInput.path`. */
  path?: string;
}

export const defaultListDeps = (cwd: string): ListDeps => ({
  ...defaultRangeDeps(cwd),
  write: (text) => process.stdout.write(text),
});

/**
 * `list [revision]` — the catalogue browser (no argument) or a dry run of
 * `upgrade <revision>` (with one).
 *
 * The two forms are distinguished by whether a revision was given, not by a
 * default: unlike `upgrade`, `list` has none, because a bare `list` is a
 * deliberately different thing — the whole catalogue, offline, no manifest
 * read. Given a revision, this shares `resolveRange` with `upgrade`, so the
 * range shown is exactly what `upgrade <revision>` would act on. Unlike
 * `upgrade`, an unresolved-but-not-an-upgrade target (e.g. an exact version at
 * or below current) is not a refusal here — `resolveRange` reports it as `ok:
 * true`, and `list` shows it like any other range (which is typically empty,
 * and prints "Nothing to migrate in that range.").
 */
export const runList = async (
  parsed: ParsedCommand,
  deps: ListDeps,
): Promise<number> => {
  const { revision } = parsed;

  if (revision === undefined) {
    deps.write(
      renderList({
        entries: allEntries,
        json: parsed.json,
        color: deps.color,
        width: deps.width,
        path: deps.path,
      }),
    );
    return 0;
  }

  const resolved = await resolveRange(revision, deps);
  if (!resolved.ok) {
    deps.write(`${resolved.reason}\n`);
    return 1;
  }

  deps.write(
    renderList({
      entries: allEntries,
      range: { from: resolved.current, to: resolved.target },
      json: parsed.json,
      color: deps.color,
      width: deps.width,
      path: deps.path,
    }),
  );
  return 0;
};
