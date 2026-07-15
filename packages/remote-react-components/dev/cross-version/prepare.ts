import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCrossVersionTargets } from "./resolveCrossVersionTargets";

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

const installVersion = (version: string): void => {
  const dir = join(installRoot, version);
  const target = installPathFor(version);
  if (existsSync(target)) {
    console.log(`[cross-version] ${version} already installed, skipping`);
    return;
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
  execFileSync(
    "npm",
    ["install", "--prefix", dir, `${PACKAGE_NAME}@${version}`],
    {
      stdio: "inherit",
    },
  );
};

const main = (): void => {
  const currentVersion = readCurrentVersion();
  const published = fetchPublishedVersions();
  const excluded = readExcluded();

  const targets = resolveCrossVersionTargets(
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
  for (const target of targets) {
    installVersion(target.version);
  }

  const manifest = {
    resolvedAt: new Date().toISOString(),
    packageName: PACKAGE_NAME,
    targets: targets.map((t) => ({
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
    `[cross-version] wrote manifest with ${targets.length} target(s): ` +
      targets.map((t) => `${t.category}=${t.version}`).join(", "),
  );
};

main();
