import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type SelectedTargetVersion,
  selectCrossVersionTargetVersions,
} from "./selectTargetVersions";

const PACKAGE_NAME = "@mittwald/flow-remote-react-components";
const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");
const installRoot = join(packageRoot, "node_modules", ".cross-version");

export const installPathFor = (version: string): string =>
  join(installRoot, version, "node_modules", PACKAGE_NAME);

const readCurrentVersion = (): string => {
  const pkg = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as { version: string };
  return pkg.version;
};

const readExcluded = (): string[] => {
  const config = JSON.parse(
    readFileSync(join(packageRoot, "cross-version.exclude.json"), "utf8"),
  ) as { excluded: { version: string }[] };
  return config.excluded.map((e) => e.version);
};

// npm (not pnpm) on purpose throughout this file: we query and install the real
// PUBLISHED packages against the registry. This dir lives inside a pnpm
// workspace, so pnpm would resolve the target's transitive @mittwald/* deps to
// the LOCAL workspace sources instead of the versions published alongside it —
// exactly what we must avoid. npm has no workspace awareness here, so it fetches
// the genuine published tree (and surfaces publish gaps as ETARGET, see below).
const fetchPublishedVersions = (): string[] => {
  const raw = execFileSync(
    "npm",
    ["view", PACKAGE_NAME, "versions", "--json"],
    {
      encoding: "utf8",
    },
  );
  return JSON.parse(raw) as string[];
};

/**
 * Publish timestamps of every version, used to pin each install to the
 * dependency tree of its own release date.
 */
const fetchPublishTimes = (): Record<string, string> => {
  const raw = execFileSync("npm", ["view", PACKAGE_NAME, "time", "--json"], {
    encoding: "utf8",
  });
  return JSON.parse(raw) as Record<string, string>;
};

/*
 * A published version's manifest pins only its own @mittwald/* deps exactly;
 * everything else is a range, and npm resolves a range to whatever is newest
 * at install time. That makes the OLD side of the comparison drift with the
 * registry: a dependency release changes what the old version renders, with
 * no commit in this repo, and the harness turns red or green depending on
 * whether the CI cache happens to hold an older install.
 *
 * `--before` resolves every dependency as of the version's own publish date,
 * which is both deterministic and what the harness actually means by "what
 * this old version rendered". The stamp invalidates installs from before this
 * policy, which a restored cache still carries.
 */
const RESOLUTION_POLICY = "before-publish-date+1h";

/*
 * One release publishes every package in turn, so a sibling this version
 * depends on can carry a timestamp a few seconds later than its own — a cutoff
 * at the exact publish time drops it with ETARGET. An hour covers a release
 * run and stays far short of the next third-party release.
 */
const RESOLUTION_MARGIN_MS = 60 * 60 * 1000;

const resolutionCutoff = (publishedAt: string): string =>
  new Date(Date.parse(publishedAt) + RESOLUTION_MARGIN_MS).toISOString();
const stampPathFor = (dir: string): string =>
  join(dir, ".cross-version-resolution");

const installIsCurrent = (dir: string, target: string): boolean => {
  if (!existsSync(target)) {
    return false;
  }
  try {
    return readFileSync(stampPathFor(dir), "utf8").trim() === RESOLUTION_POLICY;
  } catch {
    return false;
  }
};

const installVersion = (version: string, publishedAt?: string): boolean => {
  const dir = join(installRoot, version);
  const target = installPathFor(version);
  if (installIsCurrent(dir, target)) {
    console.log(`[cross-version] ${version} already installed, skipping`);
    return true;
  }
  // A stale install from an earlier policy, or a partial one from an aborted
  // run, would otherwise be kept by npm. Best-effort: npm overwrites anyway.
  if (existsSync(dir)) {
    try {
      rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
    } catch {
      // best-effort cleanup
    }
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      { name: `cross-version-${version}`, private: true },
      null,
      2,
    ),
  );
  const cutoff = publishedAt ? resolutionCutoff(publishedAt) : undefined;
  const before = cutoff ? ["--before", cutoff] : [];
  console.log(
    `[cross-version] installing ${PACKAGE_NAME}@${version}` +
      (cutoff ? ` (deps as of ${cutoff})` : " (deps unpinned)"),
  );
  try {
    execFileSync(
      "npm",
      ["install", "--prefix", dir, ...before, `${PACKAGE_NAME}@${version}`],
      {
        stdio: "inherit",
      },
    );
    writeFileSync(stampPathFor(dir), RESOLUTION_POLICY);
    return true;
  } catch (err) {
    // Remove the partial install dir so a later run doesn't treat it as
    // installed. Failures here are typically a repo publish gap: the version's
    // dependency tree pins a transitive @mittwald/* version that was never
    // published to npm (ETARGET). Cleanup is best-effort — never let it crash.
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(
      `[cross-version] WARNING: skipping ${version} — install failed: ${reason} (often an unpublished transitive dependency)`,
    );
    return false;
  }
};

const main = (): void => {
  const currentVersion = readCurrentVersion();
  const published = fetchPublishedVersions();
  const publishTimes = fetchPublishTimes();
  const excluded = readExcluded();

  const targets = selectCrossVersionTargetVersions(
    currentVersion,
    published,
    excluded,
  );
  if (targets.length === 0) {
    console.warn(
      "[cross-version] no target versions resolved — nothing to test",
    );
  }

  mkdirSync(installRoot, { recursive: true });
  const installed: SelectedTargetVersion[] = [];
  const dropped: SelectedTargetVersion[] = [];
  for (const target of targets) {
    if (installVersion(target.version, publishTimes[target.version])) {
      installed.push(target);
    } else {
      dropped.push(target);
    }
  }

  if (dropped.length > 0) {
    console.warn(
      `[cross-version] WARNING: dropped ${dropped.length} un-installable ` +
        `version(s): ` +
        dropped.map((t) => `${t.category}=${t.version}`).join(", "),
    );
  }
  if (installed.length === 0) {
    console.warn(
      "[cross-version] WARNING: no installable versions found — writing an " +
        "empty manifest (cross-version smoke tests will have nothing to run)",
    );
  }

  const manifest = {
    resolvedAt: new Date().toISOString(),
    packageName: PACKAGE_NAME,
    targets: installed.map((t) => ({
      category: t.category,
      version: t.version,
      installPath: installPathFor(t.version),
    })),
  };
  writeFileSync(
    join(packageRoot, "cross-version.manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `[cross-version] wrote manifest with ${installed.length} target(s): ` +
      installed.map((t) => `${t.category}=${t.version}`).join(", "),
  );
};

main();
