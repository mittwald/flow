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

const installVersion = (version: string): boolean => {
  const dir = join(installRoot, version);
  const target = installPathFor(version);
  if (existsSync(target)) {
    console.log(`[cross-version] ${version} already installed, skipping`);
    return true;
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
  console.log(`[cross-version] installing ${PACKAGE_NAME}@${version}`);
  try {
    execFileSync(
      "npm",
      ["install", "--prefix", dir, `${PACKAGE_NAME}@${version}`],
      {
        stdio: "inherit",
      },
    );
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
    if (installVersion(target.version)) {
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
