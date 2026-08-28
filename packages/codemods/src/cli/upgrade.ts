import { writeFileSync } from "node:fs";
import { isAbsolute, relative } from "node:path";
import { gt } from "semver";
import { allEntries, type CatalogEntry } from "../catalog/entries.js";
import { selectEntries } from "../catalog/select.js";
import { flowPackages } from "../flowPackages.generated.js";
import { hasUncommittedChanges } from "../git.js";
import {
  detectPackageManagerIn,
  runInstall,
  type InstallRunner,
} from "../install.js";
import { applyTarget } from "../manifest.js";
import { fetchVersions } from "../resolve/registry.js";
import { readInstalledVersion, resolveRange } from "../resolve/range.js";
import { runCodemod, type CodemodResult } from "../run/jscodeshift.js";
import type { ParsedCommand } from "./args.js";
import { resolveSourcePath } from "./codemod.js";
import { renderList } from "./list.js";

export interface UpgradeDeps {
  cwd: string;
  fetchVersions: typeof fetchVersions;
  install: InstallRunner;
  runCodemod: typeof runCodemod;
  /** Which codemods to apply. `-y` and a non-TTY pass everything through. */
  choose: (entries: CatalogEntry[]) => Promise<CatalogEntry[]>;
  isDirty: (cwd: string) => boolean;
  readInstalledVersion: (cwd: string, name: string) => string | undefined;
  log: (message: string) => void;
}

export const defaultUpgradeDeps = (cwd: string): UpgradeDeps => ({
  cwd,
  fetchVersions,
  install: runInstall,
  runCodemod,
  choose: async (entries) => entries,
  isDirty: hasUncommittedChanges,
  readInstalledVersion,
  log: (message) => process.stdout.write(`${message}\n`),
});

/**
 * Whether `path` lies outside `cwd`.
 *
 * `--path` can point anywhere, including outside the repository the dirty-tree
 * guard checks. `path` is always resolved (see `resolveSourcePath`), so this is
 * a plain prefix test via `relative` rather than a string comparison that a
 * trailing slash or `..` segment could fool.
 */
const isOutside = (path: string, cwd: string): boolean => {
  const rel = relative(cwd, path);
  return rel !== "" && (rel.startsWith("..") || isAbsolute(rel));
};

/**
 * The indentation the manifest already uses, read from its first indented line.
 *
 * Reusing it (instead of always emitting 2 spaces) keeps the rewrite to the
 * dependency lines a consumer actually cares about — a tabs- or 4-space project
 * otherwise gets its whole `package.json` reformatted inside the upgrade diff.
 */
const detectIndent = (raw: string): string => {
  const match = /\n([ \t]+)\S/.exec(raw);
  return match?.[1] ?? "  ";
};

/**
 * Bump every Flow dependency, install, then run the codemods the resolved range
 * calls for — and end by naming what no codemod covers.
 *
 * The order is not cosmetic: the codemods run against the installed target, so
 * `tsc` can be green when the command returns. `--dry` skips both the manifest
 * write and the install, so the codemods it still runs act against whatever is
 * currently installed rather than the target — their output is indicative, not
 * exact.
 *
 * A codemod's selection has no lower bound (see `selectEntries`) — running one
 * twice is a verified no-op — so a project already on `target` still gets a
 * codemod pass: it skips only the write and the install, which genuinely have
 * nothing to do. A manual migration keeps its lower bound, so nothing there
 * gets re-surfaced just because this now runs more often.
 */
export const runUpgrade = async (
  parsed: ParsedCommand,
  deps: UpgradeDeps,
): Promise<number> => {
  const { cwd, log } = deps;
  const dry = parsed.dry === true;

  // Resolved before the dirty-tree guard below: an explicit --path can point
  // outside the repository the guard would otherwise check, and codemods
  // rewrite files in place there just the same.
  const path = resolveSourcePath(parsed.path, cwd);
  const outsideRepo = isOutside(path, cwd);

  if (
    !parsed.allowDirty &&
    (deps.isDirty(cwd) || (outsideRepo && deps.isDirty(path)))
  ) {
    log(
      "The working tree has uncommitted changes. Codemods rewrite files in place, so commit or stash first — or pass --allow-dirty.",
    );
    return 1;
  }

  const { revision } = parsed;
  if (revision === undefined) {
    // args.ts always defaults this for the "upgrade" command — this only
    // guards a ParsedCommand built by hand without it, so it is not a second
    // source of truth for the default.
    log("No revision given.");
    return 1;
  }

  const range = await resolveRange(revision, deps);
  if (!range.ok) {
    log(range.reason);
    return 1;
  }
  const { manifestPath, manifestRaw, manifest, dependencies, current, target } =
    range;

  // A stale dist-tag or an exact version at or below `current` resolves
  // without complaint — `resolveRange` deliberately does not judge that
  // (`list` treats the same fact as a legitimate answer). There is nothing to
  // bump or install in that case, but — unlike before — that no longer means
  // there is nothing to run: a `codemod` entry's lower bound is gone (see
  // `selectEntries`), because re-running one is a verified no-op. A consumer
  // can already be sitting on `target` having never run this tool once, which
  // is the exact gap this command exists to close, so the codemod pass below
  // still runs; only the bump and the install are skipped.
  const bump = gt(target, current);

  if (!bump) {
    // Nothing to write or install — fall through to the codemod pass below.
    log(
      `Already on ${current}; "${revision}" resolves to ${target}. No dependency bump needed — checking for codemods to catch up on, since nothing records whether this project already ran them.`,
    );
  } else if (dry) {
    log(`Upgrading Flow from ${current} to ${target} (--dry)`);
    log(`--dry: would write the following to ${manifestPath}:`);
    for (const { name } of dependencies) {
      log(`  ${name} → ${target}`);
    }
    log("--dry: skipping the install.");
  } else {
    log(`Upgrading Flow from ${current} to ${target}`);
    const indent = detectIndent(manifestRaw);
    writeFileSync(
      manifestPath,
      `${JSON.stringify(
        applyTarget(manifest, target, flowPackages),
        null,
        indent,
      )}\n`,
      "utf8",
    );
    for (const { name } of dependencies) {
      log(`  ${name} → ${target}`);
    }

    const manager = detectPackageManagerIn(cwd);
    log(`Installing with ${manager}`);
    try {
      deps.install(manager, cwd);
    } catch (error) {
      log(
        `The dependency bump was written but the install failed, so package.json is on\n${target} while node_modules still holds ${current}.\n\nEither re-run this command once the install works, or undo the bump with\n  git checkout package.json\n\n${
          error instanceof Error ? error.message : error
        }`,
      );
      return 1;
    }
  }

  const selected = selectEntries(allEntries, current, target);
  const automatic = selected.filter((entry) => entry.action === "codemod");
  const byHand = selected.filter((entry) => entry.action !== "codemod");

  const chosen = await deps.choose(automatic);

  // Only meaningful once a bump actually moves the installed version away
  // from `target` — when there is no bump, the codemods below run against
  // exactly `target` already, so there is no "not exact" caveat to raise.
  if (dry && bump && chosen.length > 0) {
    log(
      `\n--dry: running the codemods against the currently installed version, not ${target} — their output is indicative, not exact.`,
    );
  }

  let hadFailure = false;
  const incomplete: string[] = [];
  let ranCount = 0;
  let changedCount = 0;

  for (const entry of chosen) {
    ranCount += 1;
    let result: CodemodResult;
    try {
      result = await deps.runCodemod({
        id: entry.id,
        path,
        dry: parsed.dry,
        print: parsed.print,
      });
    } catch (error) {
      hadFailure = true;
      incomplete.push(entry.id);
      log(
        `  ${entry.id}: failed to run — ${
          error instanceof Error ? error.message : error
        }`,
      );
      continue;
    }

    if (result.changed > 0) {
      changedCount += 1;
    }

    // Same three-way distinction as the single-codemod command: "0 changed" on
    // its own would read as success where nothing was looked at, or where the
    // transform declined everything it saw.
    if (result.errors > 0) {
      hadFailure = true;
      log(`  ${entry.id}: ${result.errors} file(s) failed to transform`);
    } else if (result.processedNothing) {
      hadFailure = true;
      log(`  ${entry.id}: no files under ${path} were processed`);
    } else if (result.changed === 0 && result.skipped > 0) {
      hadFailure = true;
      log(`  ${entry.id}: declined all ${result.skipped} file(s) it looked at`);
    } else {
      log(`  ${entry.id}: ${result.changed} file(s) changed`);
    }
  }

  // Dropping the lower bound for codemods (see `selectEntries`) means this
  // loop can run every codemod in the catalogue on a project that never
  // crossed a version at all — "N run, 0 changed" is the confirmation that
  // there was nothing to catch up on, not a list of new work.
  if (ranCount > 0) {
    log(
      `\n${ranCount} codemod${ranCount === 1 ? "" : "s"} run, ${changedCount} changed something.`,
    );
  }

  if (byHand.length > 0) {
    log(
      `\n${byHand.length} migration(s) in this range have no codemod — apply them by hand:\n`,
    );
    // `header: false` — this already printed the heading above; renderList's
    // own header (the "N migrations …" summary, counts, and legend) would
    // just repeat it for the same list.
    log(renderList({ entries: byHand, json: false, header: false }));
  } else {
    log("\nNo migration in this range required a change by hand.");
  }

  if (incomplete.length > 0) {
    log(
      `\n${incomplete.length} codemod(s) did not complete: ${incomplete.join(", ")}`,
    );
  }

  return hadFailure ? 1 : 0;
};
