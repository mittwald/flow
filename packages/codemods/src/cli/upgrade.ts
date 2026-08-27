import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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
import {
  applyTarget,
  detectCurrentVersion,
  findFlowDependencies,
  type Manifest,
} from "../manifest.js";
import { fetchVersions } from "../resolve/registry.js";
import { resolveTarget } from "../resolve/target.js";
import {
  runCodemod,
  type CodemodOptions,
  type CodemodResult,
} from "../run/jscodeshift.js";
import type { ParsedCommand } from "./args.js";
import { resolveSourcePath } from "./codemod.js";
import { renderList } from "./list.js";

export interface UpgradeDeps {
  cwd: string;
  fetchVersions: typeof fetchVersions;
  install: InstallRunner;
  /**
   * Allowed to answer synchronously as well as with a promise — the real runner
   * is async, a test double has no reason to be.
   */
  runCodemod: (
    options: CodemodOptions,
  ) => CodemodResult | Promise<CodemodResult>;
  /** Which codemods to apply. `-y` and a non-TTY pass everything through. */
  choose: (entries: CatalogEntry[]) => Promise<CatalogEntry[]>;
  isDirty: (cwd: string) => boolean;
  readInstalledVersion: (cwd: string, name: string) => string | undefined;
  log: (message: string) => void;
}

export const readInstalledVersion = (
  cwd: string,
  name: string,
): string | undefined => {
  try {
    const manifest = JSON.parse(
      readFileSync(join(cwd, "node_modules", name, "package.json"), "utf8"),
    ) as { version?: string };
    return manifest.version;
  } catch {
    return undefined;
  }
};

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
 * Bump every Flow dependency, install, then run the codemods the crossed range
 * calls for — and end by naming what no codemod covers.
 *
 * The order is not cosmetic: the codemods run against the installed target, so
 * `tsc` can be green when the command returns.
 */
export const runUpgrade = async (
  parsed: ParsedCommand,
  deps: UpgradeDeps,
): Promise<number> => {
  const { cwd, log } = deps;

  if (!parsed.allowDirty && deps.isDirty(cwd)) {
    log(
      "The working tree has uncommitted changes. Codemods rewrite files in place, so commit or stash first — or pass --allow-dirty.",
    );
    return 1;
  }

  const manifestPath = join(cwd, "package.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const dependencies = findFlowDependencies(manifest, flowPackages);

  // Destructuring (rather than `dependencies.length === 0` plus a `[0]!`
  // later) is what lets the anchor package be read below without a non-null
  // assertion — `no-non-null-assertion` is an error in this repo's eslint
  // config.
  const [anchor] = dependencies;
  if (anchor === undefined) {
    log(`No Flow dependency found in ${manifestPath}. Nothing to upgrade.`);
    return 1;
  }

  const current = detectCurrentVersion(dependencies, (name) =>
    deps.readInstalledVersion(cwd, name),
  );
  if (current === undefined) {
    log("Could not determine the Flow version this project is on.");
    return 1;
  }

  // Every Flow package shares one version (fixed versioning), so any of them
  // answers for all — the first one found, not a hardcoded package name, since
  // a consumer may only have one Flow dependency at all.
  const { versions, distTags } = await deps.fetchVersions(anchor.name);
  const revision = parsed.revision ?? "minor";
  const target = resolveTarget({ revision, current, versions, distTags });

  if (target === undefined) {
    log(
      `Could not resolve "${revision}" to a published version of ${anchor.name}. Use patch, minor, major, a dist-tag, or an exact version.`,
    );
    return 1;
  }
  // A stale dist-tag or an exact version below `current` resolves downward
  // without complaint — `resolveTarget` deliberately does not judge that. This
  // command does: nothing crosses a boundary backwards or sideways.
  if (!gt(target, current)) {
    log(
      `Already on ${current}; "${revision}" resolves to ${target}. Nothing to do.`,
    );
    return 0;
  }

  log(`Upgrading Flow from ${current} to ${target}`);

  writeFileSync(
    manifestPath,
    `${JSON.stringify(applyTarget(manifest, target, flowPackages), null, 2)}\n`,
    "utf8",
  );
  for (const { name } of dependencies) {
    log(`  ${name} → ${target}`);
  }

  const manager = detectPackageManagerIn(cwd);
  log(`Installing with ${manager}`);
  deps.install(manager, cwd);

  const selected = selectEntries(allEntries, current, target);
  const automatic = selected.filter((entry) => entry.action === "codemod");
  const byHand = selected.filter((entry) => entry.action !== "codemod");

  const chosen = await deps.choose(automatic);
  const path = resolveSourcePath(parsed.path, cwd);

  for (const entry of chosen) {
    const result = await deps.runCodemod({
      id: entry.id,
      path,
      dry: parsed.dry,
      print: parsed.print,
    });
    // Same three-way distinction as the single-codemod command: "0 changed" on
    // its own would read as success where nothing was looked at, or where the
    // transform declined everything it saw.
    if (result.errors > 0) {
      log(`  ${entry.id}: ${result.errors} file(s) failed to transform`);
    } else if (result.processedNothing) {
      log(`  ${entry.id}: no files under ${path} were processed`);
    } else if (result.changed === 0 && result.skipped > 0) {
      log(`  ${entry.id}: declined all ${result.skipped} file(s) it looked at`);
    } else {
      log(`  ${entry.id}: ${result.changed} file(s) changed`);
    }
  }

  if (byHand.length > 0) {
    log(
      `\n${byHand.length} migration(s) in this range have no codemod. They are still open:\n`,
    );
    log(renderList({ entries: byHand, json: false }));
  } else {
    log("\nEvery migration in this range had a codemod.");
  }

  return 0;
};
