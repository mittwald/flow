import { existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { allEntries, unknownCodemodMessage } from "../catalog/entries.js";
import type { ParsedCommand } from "./args.js";
import { runCodemod, transformExists } from "../run/jscodeshift.js";

/**
 * Which sources to transform, resolved against `cwd`.
 *
 * `src` is the default because that is where a Flow consumer's components live,
 * and the working directory is the fallback. The caller prints the result
 * either way — a codemod that silently ran over the wrong tree is worse than
 * one that refused.
 *
 * Always returns a path rooted at `cwd` (an absolute `--path` is left alone).
 * jscodeshift resolves a relative path against `process.cwd()`, not against
 * whatever `cwd` a caller injected — a bare `"src"` would only be correct when
 * the two coincide, which is true in production but not in a test that injects
 * a different `cwd`.
 */
export const resolveSourcePath = (
  explicit: string | undefined,
  cwd: string,
  exists: (path: string) => boolean = existsSync,
): string => {
  if (explicit !== undefined) {
    return isAbsolute(explicit) ? explicit : join(cwd, explicit);
  }
  return exists(join(cwd, "src")) ? join(cwd, "src") : cwd;
};

/**
 * The same choice as `resolveSourcePath`, in the form a reader would type.
 *
 * `list` prints a runnable command per codemod entry, and it used to hardcode
 * `src` there. On a project whose sources are anywhere else, pasting that line
 * runs the codemod against a directory that does not exist — and the run then
 * reports "no files under <path> were processed. Is the path right?", sending
 * the reader after a path they were handed. So the printed command has to carry
 * the path actually in use.
 *
 * Relative, not the absolute result of `resolveSourcePath`: a copy-pasteable
 * command should stay short and keep working from the same directory the reader
 * already is in. `"."` when the resolved path is `cwd` itself — a bare command
 * with no argument would default back to `src` and pick the wrong tree.
 */
export const displaySourcePath = (
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

  // No catalogue entry is not the same as unknown: `to-remote-package` is a
  // transform deliberately kept out of the catalogue (it is a port, not a
  // migration — see `notAMigration` in `src/tests/remoteScope.test.ts`), and it
  // still has to be reachable by id. Only fall back to the transform file when
  // the catalogue does not know the id at all; a catalogued id whose action is
  // "manual" or "none" still has no transform to run, regardless of what is on
  // disk.
  if (entry === undefined) {
    if (!transformExists(id)) {
      log(unknownCodemodMessage(id));
      return 1;
    }
  } else if (entry.action !== "codemod") {
    log(
      `"${id}" has no codemod — it is a ${entry.action === "none" ? "behaviour change" : "manual change"}.\n\napply: ${entry.apply}`,
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

  // The same trap as `processedNothing`, one field over: a transform that
  // declines a file by returning nothing counts as `skipped`, not `unmodified`.
  // If every file was skipped and none changed, "0 file(s) changed" would read
  // as a clean no-op run when in fact the transform bailed on everything.
  if (result.changed === 0 && result.skipped > 0) {
    log(
      `${id}: the transform declined all ${result.skipped} file(s) it looked at, and changed none.`,
    );
    return 1;
  }

  const skipped = result.skipped > 0 ? `, ${result.skipped} skipped` : "";
  const summary = `${id}: ${result.changed} file(s) changed, ${result.unmodified} unchanged${skipped}.`;
  // Only a catalogued id has a migration guide entry to point at — a transform
  // like `to-remote-package` with no catalogue entry has no anchor in
  // `MIGRATION.md` to link, so pointing there would be a dead link.
  const pointer =
    entry === undefined
      ? ""
      : `\nSee https://github.com/mittwald/flow/blob/main/packages/components/MIGRATION.md#${id} for what's left.`;
  log(`${summary}${pointer}`);
  return 0;
};
