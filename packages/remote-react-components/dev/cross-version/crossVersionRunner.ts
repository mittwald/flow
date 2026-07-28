import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Shared runner for both cross-version harnesses (iframe `run.ts` and
 * in-process `run-inprocess.ts`). Reads `cross-version.manifest.json` and runs
 * the given vitest suite once per installed old version with
 * `FLOW_CROSS_VERSION` set, so each old published bundle is rendered through
 * the CURRENT host and its host-rendered HTML compared against the current
 * version. The two harnesses differ only in the vitest config, a handful of
 * report labels, and whether a `--update` reference pass runs first —
 * everything else lives here.
 *
 * Looping in node (not a package.json shell loop) keeps it cross-platform.
 * Exits non-zero if ANY version fails; prints a PASS/FAIL summary.
 */

// This module lives in dev/cross-version/, so ../.. is the package root.
const here = dirname(fileURLToPath(import.meta.url));
export const packageRoot = resolve(here, "../..");

// Resolve the vitest CLI entry via its package.json `bin` (the bin path itself
// is not an allowed `exports` subpath, so it can't be `require.resolve`d
// directly). Running it with the current node binary avoids nested
// pnpm/corepack spawns, which can break.
const require = createRequire(import.meta.url);
const vitestPackagePath = require.resolve("vitest/package.json");
const vitestPackage = JSON.parse(readFileSync(vitestPackagePath, "utf8")) as {
  bin: { vitest: string };
};
const vitestBin = join(dirname(vitestPackagePath), vitestPackage.bin.vitest);

export interface ManifestTarget {
  category: string;
  version: string;
}

interface Manifest {
  targets: ManifestTarget[];
}

export interface VersionResult {
  version: string;
  ok: boolean;
  /** Full names of the failed tests/scenarios (empty if the whole run died). */
  failures: string[];
}

/** Strings that differ between the iframe and in-process runners. */
export interface RunnerLabels {
  /** Console log prefix, e.g. `[cross-version]`. */
  logPrefix: string;
  /** GitHub error-annotation title prefix, e.g. `cross-version`. */
  errorTitlePrefix: string;
  /** Step-summary heading, e.g. `Cross-version smoke tests`. */
  summaryHeading: string;
  /** Step-summary failure-column header, e.g. `failing scenarios`. */
  failureColumn: string;
  /** Unique GITHUB_OUTPUT heredoc delimiter base, e.g. `CROSSVER_EOF`. */
  outputDelimiter: string;
}

export interface RunCrossVersionOptions {
  /** Vitest config path, relative to the package root. */
  vitestConfig: string;
  /** Mkdtemp prefix for the per-run results directory. */
  tempPrefix: string;
  labels: RunnerLabels;
  /**
   * When set, a `current` reference pass runs first with `--update`, writing
   * into `refDirectory` (wiped + recreated first). The in-process harness needs
   * this; the iframe harness renders its reference inline, so it omits it.
   */
  reference?: { refDirectory: string };
}

const readManifest = (logPrefix: string): Manifest => {
  const path = join(packageRoot, "cross-version.manifest.json");
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Manifest;
  } catch {
    throw new Error(
      `cross-version.manifest.json not found at ${path}. ` +
        `Run \`test:cross-version:prepare\` first. (${logPrefix})`,
    );
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readFailures = (jsonPath: string): string[] => {
  try {
    const report: unknown = JSON.parse(readFileSync(jsonPath, "utf8"));
    if (!isRecord(report) || !Array.isArray(report.testResults)) {
      return [];
    }

    const failures = report.testResults.flatMap((testResult) => {
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

    return [...new Set(failures)];
  } catch {
    return [];
  }
};

/** Run the vitest suite for one FLOW_CROSS_VERSION value. */
const runSuite = (
  crossVersion: string,
  { vitestConfig, tempPrefix }: RunCrossVersionOptions,
  update = false,
): VersionResult => {
  const tempDirectory = mkdtempSync(join(tmpdir(), tempPrefix));
  const jsonPath = join(tempDirectory, "vitest-results.json");
  const args = [
    vitestBin,
    "run",
    `--config=${vitestConfig}`,
    "--browser.headless",
    "--reporter=default",
    "--reporter=json",
    `--outputFile=${jsonPath}`,
    ...(update ? ["--update"] : []),
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

  const failures = readFailures(jsonPath);
  rmSync(tempDirectory, { recursive: true, force: true });
  return { version: crossVersion, ok, failures };
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
  results.flatMap(({ version, ok, failures }) => {
    if (ok) {
      return [];
    }
    if (failures.length === 0) {
      return [`${version}: version failed (see logs)`];
    }
    return failures.map((name) => `${version}: ${name}`);
  });

const writeGitHubOutput = (failures: string, delimiterBase: string): void => {
  const path = process.env.GITHUB_OUTPUT;
  if (path === undefined) {
    return;
  }

  let delimiter = delimiterBase;
  while (failures.split("\n").includes(delimiter)) {
    delimiter += "_";
  }
  appendFileSync(path, `failures<<${delimiter}\n${failures}\n${delimiter}\n`);
};

const reportToGitHub = (
  results: VersionResult[],
  labels: RunnerLabels,
): void => {
  for (const { version, ok, failures } of results) {
    if (ok) {
      continue;
    }
    const title = escapeWorkflowCommand(
      `${labels.errorTitlePrefix} ${version}`,
      true,
    );
    if (failures.length === 0) {
      console.log(`::error title=${title}::suite failed (see logs)`);
      continue;
    }
    for (const name of failures) {
      console.log(
        `::error title=${title}::${escapeWorkflowCommand(name)} — host HTML differs from current`,
      );
    }
  }

  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (stepSummaryPath !== undefined) {
    const rows = results.map(({ version, ok, failures }) => {
      const cell = ok
        ? ""
        : failures.length > 0
          ? failures.join("<br>")
          : "version failed (see logs)";
      return `| ${escapeMarkdownCell(version)} | ${ok ? "✅" : "❌"} | ${escapeMarkdownCell(cell)} |`;
    });
    appendFileSync(
      stepSummaryPath,
      [
        `## ${labels.summaryHeading}`,
        "",
        `| version | result | ${labels.failureColumn} |`,
        "| --- | --- | --- |",
        ...rows,
        "",
      ].join("\n"),
    );
  }

  writeGitHubOutput(
    getFailureLines(results).join("\n"),
    labels.outputDelimiter,
  );
};

const withGitHubGroup = <T>(name: string, run: () => T): T => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
  if (isGitHubActions) {
    console.log(`::group::${name}`);
  }
  try {
    return run();
  } finally {
    if (isGitHubActions) {
      console.log("::endgroup::");
    }
  }
};

export const runCrossVersion = (options: RunCrossVersionOptions): void => {
  const { labels, reference } = options;
  const { logPrefix } = labels;
  const { targets } = readManifest(logPrefix);

  if (targets.length === 0) {
    console.error(
      `${logPrefix} manifest has no targets — compatibility check FAILED ` +
        "without running any versions (see prepare output).",
    );
    process.exit(1);
  }

  if (reference) {
    rmSync(reference.refDirectory, { recursive: true, force: true });
    mkdirSync(reference.refDirectory, { recursive: true });
    const result = withGitHubGroup(
      `${labels.errorTitlePrefix} reference`,
      () => {
        console.log(`\n${logPrefix} ===== current reference (update) =====`);
        return runSuite("current", options, true);
      },
    );
    if (!result.ok) {
      if (process.env.GITHUB_ACTIONS === "true") {
        reportToGitHub([{ ...result, version: "current reference" }], labels);
      }
      console.error(
        `\n${logPrefix} current reference pass FAILED; ` +
          "old-version comparisons were not run.",
      );
      process.exit(1);
    }
  }

  console.log(
    `${logPrefix} running ${targets.length} version(s): ` +
      targets.map((t) => `${t.category}=${t.version}`).join(", "),
  );

  const results = targets.map((target) => ({
    target,
    result: withGitHubGroup(
      `${labels.errorTitlePrefix} ${target.version}`,
      () => {
        console.log(
          `\n${logPrefix} ===== ${target.category} = ${target.version} =====`,
        );
        return runSuite(target.version, options);
      },
    ),
  }));

  console.log(`\n${logPrefix} summary:`);
  for (const { target, result } of results) {
    console.log(
      `  ${result.ok ? "PASS" : "FAIL"}  ${target.category} = ${target.version}`,
    );
  }

  const versionResults = results.map(({ result }) => result);
  if (process.env.GITHUB_ACTIONS === "true") {
    reportToGitHub(versionResults, labels);
  }

  const failed = versionResults.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(
      `\n${logPrefix} ${failed.length}/${results.length} version(s) FAILED`,
    );
    process.exit(1);
  }
  console.log(`\n${logPrefix} all ${results.length} version(s) passed`);
};
