import colors from "picocolors";
import { allEntries, type CatalogEntry } from "../catalog/entries.js";
import { createCheckContext } from "../checks/context.js";
import { loadVerifier } from "../checks/load.js";
import type { VerifyResult } from "../checks/types.js";
import { indent, painter, wrap } from "./list.js";

export interface VerifyEntryResult {
  entry: CatalogEntry;
  result: VerifyResult;
}

export interface RunVerifyDeps {
  /** Which entries to try. Defaults to the whole catalogue. */
  entries?: CatalogEntry[];
  /** Injectable for tests — defaults to the real module loader. */
  load?: typeof loadVerifier;
}

/**
 * Runs every available verifier over `path`.
 *
 * Only a fraction of the catalogue has a verifier module so far (see
 * `checks/load.ts`); an id with none is skipped, not reported as a failure —
 * the remaining verifiers are follow-up work, not something this run got
 * wrong.
 */
export const runVerify = async (
  path: string,
  { entries = allEntries, load = loadVerifier }: RunVerifyDeps = {},
): Promise<VerifyEntryResult[]> => {
  const context = createCheckContext(path);
  const results: VerifyEntryResult[] = [];

  for (const entry of entries) {
    const verifier = await load(entry.id);
    if (verifier === undefined) {
      continue;
    }
    results.push({ entry, result: await verifier.verify(context) });
  }

  return results;
};

const findingLine = (
  finding: VerifyResult["findings"][number],
  width: number,
  paint: ReturnType<typeof painter>,
): string[] => {
  const location = paint.dim(`${finding.file}:${finding.line}`);
  const body = wrap(finding.text, Math.max(width - indent.length, 20));
  return body.map((line, index) =>
    index === 0 ? `${indent}${location}  ${line}` : `${indent}  ${line}`,
  );
};

/** One hint row, wrapped like a `field` row but with no label to align. */
const hintLine = (
  hint: string,
  width: number,
  paint: ReturnType<typeof painter>,
): string[] =>
  wrap(hint, Math.max(width - indent.length, 20)).map(
    (line) => `${indent}${paint.dim("hint")}  ${line}`,
  );

/**
 * Renders one migration's block: its id and title first — so a hint is never
 * printed without the migration it belongs to above it — then any findings,
 * then its hints.
 */
const renderEntry = (
  { entry, result }: VerifyEntryResult,
  width: number,
  color: boolean,
): string => {
  const paint = painter(color);
  const mark = result.ok
    ? color
      ? colors.green("●")
      : "*"
    : color
      ? colors.red("●")
      : "!";

  const lines = [
    `${mark} ${paint.bold(entry.id)}  ${paint.dim(entry.title)}`,
    ...result.findings.flatMap((finding) => findingLine(finding, width, paint)),
    ...result.hints.flatMap((hint) => hintLine(hint, width, paint)),
  ];

  return lines.join("\n");
};

/**
 * The two-number summary this command exists to get right: how many checks this
 * run could decide passed, and how many entries still need a person — running
 * `tsc --noEmit`, or judging something no compiler check can catch.
 * Deliberately never "done" or "complete": `ok: true` on an entry means only
 * "what this module could check passed," never that the migration is finished —
 * see `checks/types.ts`'s doc comment on `VerifyResult`.
 */
export const summarize = (
  results: VerifyEntryResult[],
): { passed: number; needsPerson: number } => ({
  passed: results.filter(({ result }) => result.ok).length,
  needsPerson: results.filter(({ result }) => result.hints.length > 0).length,
});

/**
 * Renders `runVerify`'s result as text — the presentation half kept separate
 * from the async file-reading half, the same split `renderList` uses.
 */
export const renderVerify = (
  results: VerifyEntryResult[],
  path: string,
  { color = false, width = 80 }: { color?: boolean; width?: number } = {},
): string => {
  const paint = painter(color);

  if (results.length === 0) {
    return `No verifiers are available yet for anything under ${path}.\n`;
  }

  const { passed, needsPerson } = summarize(results);
  const noun = results.length === 1 ? "migration" : "migrations";
  const header = `${paint.bold(`${results.length} ${noun}`)} checked under ${path}\n`;
  const body = results
    .map((entryResult) => renderEntry(entryResult, width, color))
    .join("\n\n");
  const summary = `${paint.bold(`${passed}/${results.length}`)} check(s) passed · ${paint.bold(String(needsPerson))} ${needsPerson === 1 ? "entry still needs" : "entries still need"} a person (run \`tsc --noEmit\` and/or review by hand)`;

  return `${header}\n${body}\n\n${summary}\n`;
};
