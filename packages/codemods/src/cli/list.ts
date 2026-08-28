import colors from "picocolors";
import { lte } from "semver";
import { allEntries, type CatalogEntry } from "../catalog/entries.js";
import {
  hiddenEarlierManualCount,
  selectEntries,
  sortBySince,
} from "../catalog/select.js";
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
   * Render the summary header ("N migrations …", the counts, the legend). On by
   * default. `upgrade` turns it off for its by-hand section: it already printed
   * its own heading, and this renderer's header would just repeat it — see
   * `runUpgrade`.
   */
  header?: boolean;
}

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

interface Painter {
  bold: (text: string) => string;
  dim: (text: string) => string;
  code: (text: string) => string;
}

const painter = (color: boolean): Painter =>
  color
    ? { bold: colors.bold, dim: colors.dim, code: colors.cyan }
    : { bold: (text) => text, dim: (text) => text, code: (text) => text };

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
 * Whether `entry` is a codemod being shown because dropping the lower bound
 * pulled it in (`since <= current`), not because the range crosses it. Only
 * meaningful for a range-bounded list \u2014 the whole-catalogue browse has no
 * `current` to compare against.
 */
const isCatchUp = (entry: CatalogEntry, current: string | undefined): boolean =>
  current !== undefined &&
  entry.action === "codemod" &&
  lte(entry.since, current);

const renderEntry = (
  entry: CatalogEntry,
  width: number,
  color: boolean,
  catchUp: boolean,
): string => {
  const paint = painter(color);
  const action = actions[entry.action];
  // Hollow vs filled: catch-up already shipped before `current`, so re-running
  // it is a no-op rather than something the upgrade is newly bringing in \u2014 see
  // the legend line in the header.
  const symbol = catchUp ? "\u25CB" : "\u25CF";
  const mark = color ? action.paint(symbol) : catchUp ? "o" : "*";

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
        `npx @mittwald/flow-codemods@latest ${entry.id} src`,
      )}`,
    );
  }

  return lines.join("\n");
};

/**
 * "4 migrations from X to Y" (or, for a zero-width range, "4 migrations —
 * nothing newer than X") plus a count per action, and — for a range-bounded
 * list — a legend for the catch-up mark and a line naming how many manual
 * migrations the window hides.
 *
 * `entries` is the whole catalogue passed to `renderList`, not `selected`: the
 * hidden count is about what `selectEntries` excluded, which by definition is
 * not in `selected`.
 */
const renderHeader = (
  entries: CatalogEntry[],
  selected: CatalogEntry[],
  range: RenderListInput["range"],
  color: boolean,
): string => {
  const paint = painter(color);

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

  const catchUpCount = selected.filter((entry) =>
    isCatchUp(entry, range?.from),
  ).length;

  // `from`/`to` is the wrong form once they're equal — that isn't a range,
  // it's "you're already there". Say so, and — when it's why every codemod
  // below is marked catch-up — say that too, instead of leaving the reader to
  // notice the two versions match.
  const rangeText =
    range === undefined
      ? ""
      : range.from === range.to
        ? catchUpCount > 0
          ? `— nothing newer than ${range.to}; codemods below are catch-up`
          : `— nothing newer than ${range.to}`
        : `from ${range.from} to ${range.to}`;

  // Dropping the lower bound for codemods (see `selectEntries`) means a
  // range-bounded list can show every codemod in the catalogue, not just the
  // ones the range newly crosses. The legend says what the mark means and why
  // that's safe; the counts line above it already gives the "how many".
  const legend =
    catchUpCount === 0
      ? []
      : [
          `${
            color ? actions.codemod.paint("○") : "o"
          } catch-up — released at or before your current version. Codemods are idempotent, so re-running one is a safe no-op.`,
        ];

  const hiddenLine =
    range === undefined
      ? []
      : (() => {
          const hidden = hiddenEarlierManualCount(entries, range.from);
          const noun2 = hidden === 1 ? "migration" : "migrations";
          const verb = hidden === 1 ? "is" : "are";
          // "manual migrations" here and "by hand" in the counts line above
          // can look like the same bucket undercounted. They aren't: this
          // counts only `migration`-kind entries, gated by version and
          // dropped once crossed. A `deprecation` is never gated — the old
          // path still works, so it stays listed regardless of version — and
          // that's the "by hand" a reader may already see above.
          return [
            `${hidden} manual ${noun2} at or before ${range.from} ${verb} already behind and not shown. Deprecations aren't windowed by version, so any shown above stay listed regardless. Run \`list\` with no argument for the full catalogue.`,
          ];
        })();

  // The counts carry their own colour, so no dim around them — nesting the two
  // makes both weaker.
  return [
    `${paint.bold(`${selected.length} ${noun}`)}${rangeText === "" ? "" : ` ${rangeText}`}`,
    counts.join(paint.dim(" \u00B7 ")),
    ...legend,
    ...hiddenLine,
    "",
  ].join("\n");
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
 * so the rendering is deterministic in a test. `cli.ts` supplies them.
 */
export const renderList = ({
  entries,
  range,
  json,
  color = false,
  width = 80,
  header = true,
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
      : selectEntries(entries, range.from, range.to);

  if (json) {
    return JSON.stringify(selected, null, 2);
  }

  if (selected.length === 0) {
    return "Nothing to migrate in that range.\n";
  }

  const body = selected
    .map((entry) =>
      renderEntry(entry, width, color, isCatchUp(entry, range?.from)),
    )
    .join("\n\n");

  return header
    ? `${renderHeader(entries, selected, range, color)}\n${body}\n`
    : `${body}\n`;
};

export interface ListDeps extends RangeDeps {
  /**
   * Raw output writer — matches `process.stdout.write`'s own contract: no
   * newline is appended automatically.
   */
  write: (text: string) => void;
  color?: boolean;
  width?: number;
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
    }),
  );
  return 0;
};
