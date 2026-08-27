import { readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";
import { gt, rsort } from "semver";
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
import {
  fetchAllVersions,
  fetchVersions,
  intersectVersions,
} from "../resolve/registry.js";
import { resolveTarget } from "../resolve/target.js";
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
 * Bump every Flow dependency, install, then run the codemods the crossed range
 * calls for — and end by naming what no codemod covers.
 *
 * The order is not cosmetic: the codemods run against the installed target, so
 * `tsc` can be green when the command returns. `--dry` skips both the manifest
 * write and the install, so the codemods it still runs act against whatever is
 * currently installed rather than the target — their output is indicative, not
 * exact.
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

  const manifestPath = join(cwd, "package.json");
  const manifestRaw = readFileSync(manifestPath, "utf8");

  let manifest: Manifest;
  try {
    manifest = JSON.parse(manifestRaw) as Manifest;
  } catch (error) {
    log(
      `Could not parse ${manifestPath} as JSON: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return 1;
  }

  const dependencies = findFlowDependencies(manifest, flowPackages);

  // Destructuring the emptiness check (rather than `dependencies.length ===
  // 0`) sidesteps a `no-non-null-assertion` lint error at every later read of
  // `dependencies[0]` — `no-non-null-assertion` is an error in this repo's
  // eslint config.
  const [firstDependency] = dependencies;
  if (firstDependency === undefined) {
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

  // Fixed versioning keeps every Flow package's package.json version equal,
  // but Lerna publishes only the packages that actually changed, so what
  // reaches the registry diverges per package (#2887, accepted risk).
  // Resolving the target from one "anchor" dependency and writing it onto all
  // of them can pick a version some of the others never published. Resolve
  // instead from the intersection of what every declared dependency has
  // actually published, so the version this command writes is always
  // installable.
  const fetched = await fetchAllVersions(
    dependencies.map(({ name }) => name),
    deps.fetchVersions,
  );
  const versions = intersectVersions(fetched);

  if (versions.length === 0) {
    log(
      `${dependencies
        .map(({ name }) => name)
        .join(
          ", ",
        )} have no published version in common. Nothing to upgrade to.`,
    );
    return 1;
  }

  // Dist-tags come from the first declared dependency, but a tag is only kept
  // when the version it points at is one every dependency has published — an
  // unvalidated tag could otherwise resolve outside the intersection above.
  const [firstFetched] = fetched;
  const distTags = Object.fromEntries(
    Object.entries(firstFetched?.distTags ?? {}).filter(([, version]) =>
      versions.includes(version),
    ),
  );

  const { revision } = parsed;
  if (revision === undefined) {
    // args.ts always defaults this for the "upgrade" command — this only
    // guards a ParsedCommand built by hand without it, so it is not a second
    // source of truth for the default.
    log("No revision given.");
    return 1;
  }
  const target = resolveTarget({ revision, current, versions, distTags });

  if (target === undefined) {
    log(
      `Could not resolve "${revision}" to a version every declared Flow dependency has published. Use patch, minor, major, a dist-tag, or an exact version.`,
    );
    return 1;
  }

  // Defence in depth: `target` is drawn from `versions` (the intersection) or
  // from a dist-tag already validated against it, so this should never find a
  // gap. If it ever does, refuse rather than write a version some package
  // never published — naming which package lacks it and the highest version
  // every declared dependency has actually published.
  const missingFrom = fetched.find((pkg) => !pkg.versions.includes(target));
  if (missingFrom !== undefined) {
    log(
      `${missingFrom.name} has not published ${target}. The highest version every declared Flow dependency has published is ${
        rsort(versions)[0]
      }.`,
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

  log(`Upgrading Flow from ${current} to ${target}${dry ? " (--dry)" : ""}`);

  if (dry) {
    log(`--dry: would write the following to ${manifestPath}:`);
    for (const { name } of dependencies) {
      log(`  ${name} → ${target}`);
    }
    log("--dry: skipping the install.");
  } else {
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

  if (dry && chosen.length > 0) {
    log(
      `\n--dry: running the codemods against the currently installed version, not ${target} — their output is indicative, not exact.`,
    );
  }

  let hadFailure = false;
  const incomplete: string[] = [];

  for (const entry of chosen) {
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

  if (byHand.length > 0) {
    log(
      `\n${byHand.length} migration(s) in this range have no codemod — apply them by hand:\n`,
    );
    log(renderList({ entries: byHand, json: false }));
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
