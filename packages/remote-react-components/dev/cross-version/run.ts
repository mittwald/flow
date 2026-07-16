import { execFileSync } from "node:child_process";
import { appendFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
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

interface VersionResult {
  version: string;
  ok: boolean;
  failedScenarios: string[];
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readFailedScenarios = (path: string): string[] => {
  try {
    const report: unknown = JSON.parse(readFileSync(path, "utf8"));
    if (!isRecord(report) || !Array.isArray(report.testResults)) {
      return [];
    }

    const failedScenarios = report.testResults.flatMap((testResult) => {
      if (
        !isRecord(testResult) ||
        !Array.isArray(testResult.assertionResults)
      ) {
        return [];
      }

      return testResult.assertionResults.flatMap((assertionResult) => {
        if (!isRecord(assertionResult) || assertionResult.status !== "failed") {
          return [];
        }

        const title =
          typeof assertionResult.fullName === "string"
            ? assertionResult.fullName
            : assertionResult.title;
        return typeof title === "string" && title.length > 0 ? [title] : [];
      });
    });

    return [...new Set(failedScenarios)];
  } catch {
    return [];
  }
};

/** Run the vitest suite for one FLOW_CROSS_VERSION value. */
const runSuite = (crossVersion: string): VersionResult => {
  const tempDirectory = mkdtempSync(join(tmpdir(), "flow-cross-version-"));
  const jsonPath = join(tempDirectory, "vitest-results.json");
  const args = [
    vitestBin,
    "run",
    `--config=${VITEST_CONFIG}`,
    "--browser.headless",
    "--reporter=default",
    "--reporter=json",
    `--outputFile=${jsonPath}`,
  ];
  let ok: boolean;
  try {
    execFileSync(process.execPath, args, {
      cwd: packageRoot,
      stdio: "inherit",
      env: { ...process.env, FLOW_CROSS_VERSION: crossVersion },
    });
    ok = true;
  } catch {
    ok = false;
  }

  const failedScenarios = readFailedScenarios(jsonPath);
  rmSync(tempDirectory, { recursive: true, force: true });
  return { version: crossVersion, ok, failedScenarios };
};

const escapeWorkflowCommand = (value: string, property = false): string => {
  const escaped = value
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
  return property
    ? escaped.replaceAll(":", "%3A").replaceAll(",", "%2C")
    : escaped;
};

const escapeMarkdownCell = (value: string): string =>
  value.replaceAll("|", "\\|").replaceAll("\r", " ").replaceAll("\n", " ");

const getFailureLines = (results: VersionResult[]): string[] =>
  results.flatMap(({ version, ok, failedScenarios }) => {
    if (ok) {
      return [];
    }
    if (failedScenarios.length === 0) {
      return [`${version}: version failed (see logs)`];
    }
    return failedScenarios.map((scenario) => `${version}: ${scenario}`);
  });

const writeGitHubOutput = (failures: string): void => {
  const path = process.env.GITHUB_OUTPUT;
  if (path === undefined) {
    return;
  }

  let delimiter = "CROSSVER_EOF";
  while (failures.split("\n").includes(delimiter)) {
    delimiter += "_";
  }
  appendFileSync(path, `failures<<${delimiter}\n${failures}\n${delimiter}\n`);
};

const reportToGitHub = (results: VersionResult[]): void => {
  for (const { version, ok, failedScenarios } of results) {
    if (ok) {
      continue;
    }
    const title = escapeWorkflowCommand(`cross-version ${version}`, true);
    if (failedScenarios.length === 0) {
      console.log(`::error title=${title}::suite failed (see logs)`);
      continue;
    }
    for (const scenario of failedScenarios) {
      console.log(
        `::error title=${title}::${escapeWorkflowCommand(scenario)} — host HTML differs from current`,
      );
    }
  }

  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (stepSummaryPath !== undefined) {
    const rows = results.map(({ version, ok, failedScenarios }) => {
      const failures = ok
        ? ""
        : failedScenarios.length > 0
          ? failedScenarios.join("<br>")
          : "version failed (see logs)";
      return `| ${escapeMarkdownCell(version)} | ${ok ? "✅" : "❌"} | ${escapeMarkdownCell(failures)} |`;
    });
    appendFileSync(
      stepSummaryPath,
      [
        "## Cross-version smoke tests",
        "",
        "| version | result | failing scenarios |",
        "| --- | --- | --- |",
        ...rows,
        "",
      ].join("\n"),
    );
  }

  writeGitHubOutput(getFailureLines(results).join("\n"));
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

  const results: { target: ManifestTarget; result: VersionResult }[] = [];
  for (const target of targets) {
    const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
    if (isGitHubActions) {
      console.log(`::group::cross-version ${target.version}`);
    }
    console.log(
      `\n[cross-version] ===== ${target.category} = ${target.version} =====`,
    );
    try {
      results.push({ target, result: runSuite(target.version) });
    } finally {
      if (isGitHubActions) {
        console.log("::endgroup::");
      }
    }
  }

  console.log("\n[cross-version] summary:");
  for (const { target, result } of results) {
    console.log(
      `  ${result.ok ? "PASS" : "FAIL"}  ${target.category} = ${target.version}`,
    );
  }

  const versionResults = results.map(({ result }) => result);
  if (process.env.GITHUB_ACTIONS === "true") {
    reportToGitHub(versionResults);
  }

  const failed = versionResults.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(
      `\n[cross-version] ${failed.length}/${results.length} version(s) FAILED`,
    );
    process.exit(1);
  }
  console.log(`\n[cross-version] all ${results.length} version(s) passed`);
};

runCompareLoop();
