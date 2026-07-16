import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Cross-version smoke-test runner. Reads `cross-version.manifest.json` and runs
 * the HTML-output comparison suite (`e2e/cross-version/vitest.config.ts`) once
 * per installed old version, with `FLOW_CROSS_VERSION` set to that version, so
 * each old published bundle is rendered through the CURRENT host over the real
 * iframe connection and its host-rendered HTML compared against an ephemeral
 * reference rendered by the current workspace version.
 *
 * Looping in node (not a package.json shell loop) keeps it cross-platform.
 * Exits non-zero if ANY version fails; prints a PASS/FAIL summary.
 */

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

const VITEST_CONFIG = "e2e/cross-version/vitest.config.ts";

// Resolve the vitest CLI entry via its package.json `bin` (the bin path itself
// is not an allowed `exports` subpath, so it can't be `require.resolve`d
// directly). Running it with the current node binary avoids nested
// pnpm/corepack spawns, which can break.
const require = createRequire(import.meta.url);
const vitestPkgPath = require.resolve("vitest/package.json");
const vitestPkg = JSON.parse(readFileSync(vitestPkgPath, "utf8")) as {
  bin: { vitest: string };
};
const vitestBin = join(dirname(vitestPkgPath), vitestPkg.bin.vitest);

interface ManifestTarget {
  category: string;
  version: string;
}

interface Manifest {
  targets: ManifestTarget[];
}

const readManifest = (): Manifest => {
  const path = join(packageRoot, "cross-version.manifest.json");
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Manifest;
  } catch {
    throw new Error(
      `cross-version.manifest.json not found at ${path}. ` +
        "Run `test:cross-version:prepare` first.",
    );
  }
};

/** Run the vitest suite for one FLOW_CROSS_VERSION value. Returns success. */
const runSuite = (crossVersion: string): boolean => {
  const args = [
    vitestBin,
    "run",
    `--config=${VITEST_CONFIG}`,
    "--browser.headless",
  ];
  try {
    execFileSync(process.execPath, args, {
      cwd: packageRoot,
      stdio: "inherit",
      env: { ...process.env, FLOW_CROSS_VERSION: crossVersion },
    });
    return true;
  } catch {
    return false;
  }
};

const runCompareLoop = (): void => {
  const { targets } = readManifest();

  if (targets.length === 0) {
    console.error(
      "[cross-version] manifest has no targets — compatibility check FAILED " +
        "without running any versions (see prepare output).",
    );
    process.exit(1);
  }

  console.log(
    `[cross-version] running ${targets.length} version(s): ` +
      targets.map((t) => `${t.category}=${t.version}`).join(", "),
  );

  const results: { target: ManifestTarget; ok: boolean }[] = [];
  for (const target of targets) {
    console.log(
      `\n[cross-version] ===== ${target.category} = ${target.version} =====`,
    );
    results.push({ target, ok: runSuite(target.version) });
  }

  console.log("\n[cross-version] summary:");
  for (const { target, ok } of results) {
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${target.category} = ${target.version}`,
    );
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(
      `\n[cross-version] ${failed.length}/${results.length} version(s) FAILED`,
    );
    process.exit(1);
  }
  console.log(`\n[cross-version] all ${results.length} version(s) passed`);
};

runCompareLoop();
