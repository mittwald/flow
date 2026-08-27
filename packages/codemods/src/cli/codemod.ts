import { existsSync } from "node:fs";
import { join } from "node:path";
import { allEntries } from "../catalog/entries.js";
import type { ParsedCommand } from "./args.js";
import { runCodemod } from "../run/jscodeshift.js";

/**
 * Which sources to transform.
 *
 * `src` is the default because that is where a Flow consumer's components live,
 * and the working directory is the fallback. The caller prints the result
 * either way — a codemod that silently ran over the wrong tree is worse than
 * one that refused.
 */
export const resolveSourcePath = (
  explicit: string | undefined,
  cwd: string,
  exists: (path: string) => boolean = existsSync,
): string => {
  if (explicit !== undefined) {
    return explicit;
  }
  return exists(join(cwd, "src")) ? "src" : ".";
};

export interface CodemodCommandDeps {
  cwd: string;
  log: (message: string) => void;
  run?: typeof runCodemod;
}

export const runSingleCodemod = async (
  parsed: ParsedCommand,
  { cwd, log, run = runCodemod }: CodemodCommandDeps,
): Promise<number> => {
  const id = parsed.id ?? "";
  const entry = allEntries.find((candidate) => candidate.id === id);

  if (entry === undefined) {
    log(
      `"${id}" is not a codemod in this package. Run \`flow-codemods list\` to see the available ids.`,
    );
    return 1;
  }
  if (entry.action !== "codemod") {
    log(
      `"${id}" has no codemod — it is a ${entry.action === "none" ? "behaviour change" : "manual change"}.\n\napply:  ${entry.apply}\nverify: ${entry.verify}`,
    );
    return 1;
  }

  const path = resolveSourcePath(parsed.path, cwd);
  log(`Running ${id} over ${path}`);

  const result = await run({ id, path, dry: parsed.dry, print: parsed.print });

  if (result.errors > 0) {
    log(`${id}: ${result.errors} file(s) failed to transform.`);
    return 1;
  }
  // Not the same as "0 files changed": jscodeshift reports an empty path and a
  // dead worker identically, so say what happened rather than implying success.
  if (result.processedNothing) {
    log(`${id}: no files under ${path} were processed. Is the path right?`);
    return 1;
  }

  log(
    `${id}: ${result.changed} file(s) changed, ${result.unmodified} unchanged.\nverify: ${entry.verify}`,
  );
  return 0;
};
