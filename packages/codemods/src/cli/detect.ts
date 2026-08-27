import colors from "picocolors";
import { allEntries, type CatalogEntry } from "../catalog/entries.js";
import { createCheckContext } from "../checks/context.js";
import { loadDetector } from "../checks/load.js";
import type { Finding } from "../checks/types.js";
import { indent, painter, wrap } from "./list.js";

export interface DetectEntryResult {
  entry: CatalogEntry;
  findings: Finding[];
}

export interface RunDetectDeps {
  /** Which entries to try. Defaults to the whole catalogue. */
  entries?: CatalogEntry[];
  /** Injectable for tests — defaults to the real module loader. */
  load?: typeof loadDetector;
}

/**
 * Runs every available detector over `path` and returns only the entries that
 * found something.
 *
 * Only a fraction of the catalogue has a detector module so far (see
 * `checks/load.ts`); an id with none is skipped rather than treated as a
 * failure — the remaining detectors are mechanical follow-up work, not a bug in
 * this command.
 */
export const runDetect = async (
  path: string,
  { entries = allEntries, load = loadDetector }: RunDetectDeps = {},
): Promise<DetectEntryResult[]> => {
  const context = createCheckContext(path);
  const results: DetectEntryResult[] = [];

  for (const entry of entries) {
    const detector = await load(entry.id);
    if (detector === undefined) {
      continue;
    }
    const findings = await detector.detect(context);
    if (findings.length > 0) {
      results.push({ entry, findings });
    }
  }

  return results;
};

/** One `file:line text` row, wrapped and indented like `renderList`'s rows. */
const findingLine = (
  finding: Finding,
  width: number,
  paint: ReturnType<typeof painter>,
): string[] => {
  const location = paint.dim(`${finding.file}:${finding.line}`);
  const body = wrap(finding.text, Math.max(width - indent.length, 20));
  return body.map((line, index) =>
    index === 0 ? `${indent}${location}  ${line}` : `${indent}  ${line}`,
  );
};

/**
 * Renders `runDetect`'s result as text — the presentation half kept separate
 * from the async file-reading half, the same split `renderList` uses, so
 * formatting is testable without touching a file. Reuses `renderList`'s
 * vocabulary (`painter`, `wrap`, `indent`) rather than a second
 * implementation.
 */
export const renderDetect = (
  results: DetectEntryResult[],
  path: string,
  { color = false, width = 80 }: { color?: boolean; width?: number } = {},
): string => {
  const paint = painter(color);

  if (results.length === 0) {
    return `No migrations under ${path} were found by the available detectors.\n`;
  }

  const noun = results.length === 1 ? "migration" : "migrations";
  const header = `${paint.bold(`${results.length} ${noun}`)} touch ${path}\n`;

  const body = results
    .map(({ entry, findings }) => {
      const mark = color ? colors.green("●") : "*";
      const lines = [
        `${mark} ${paint.bold(entry.id)}  ${paint.dim(entry.title)}`,
        ...findings.flatMap((finding) => findingLine(finding, width, paint)),
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  return `${header}\n${body}\n`;
};
