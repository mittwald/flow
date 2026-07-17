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

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");
const vitestConfig = "e2e/cross-version-inprocess/vitest.config.ts";
const refDirectory = join(packageRoot, "e2e/cross-version-inprocess/.refs");

const require = createRequire(import.meta.url);
const vitestPackagePath = require.resolve("vitest/package.json");
const vitestPackage = JSON.parse(readFileSync(vitestPackagePath, "utf8")) as {
  bin: { vitest: string };
};
const vitestBin = join(dirname(vitestPackagePath), vitestPackage.bin.vitest);

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
  failedTests: string[];
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

const readFailedTests = (path: string): string[] => {
  try {
    const report: unknown = JSON.parse(readFileSync(path, "utf8"));
    if (!isRecord(report) || !Array.isArray(report.testResults)) {
      return [];
    }

    const failedTests = report.testResults.flatMap((testResult) => {
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

    return [...new Set(failedTests)];
  } catch {
    return [];
  }
};

const runSuite = (crossVersion: string, update = false): VersionResult => {
  const tempDirectory = mkdtempSync(
    join(tmpdir(), "flow-cross-version-inprocess-"),
  );
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

  const failedTests = readFailedTests(jsonPath);
  rmSync(tempDirectory, { recursive: true, force: true });
  return { version: crossVersion, ok, failedTests };
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
  results.flatMap(({ version, ok, failedTests }) => {
    if (ok) {
      return [];
    }
    if (failedTests.length === 0) {
      return [`${version}: version failed (see logs)`];
    }
    return failedTests.map((testName) => `${version}: ${testName}`);
  });

const writeGitHubOutput = (failures: string): void => {
  const path = process.env.GITHUB_OUTPUT;
  if (path === undefined) {
    return;
  }

  let delimiter = "CROSSVER_INPROCESS_EOF";
  while (failures.split("\n").includes(delimiter)) {
    delimiter += "_";
  }
  appendFileSync(path, `failures<<${delimiter}\n${failures}\n${delimiter}\n`);
};

const reportToGitHub = (results: VersionResult[]): void => {
  for (const { version, ok, failedTests } of results) {
    if (ok) {
      continue;
    }
    const title = escapeWorkflowCommand(
      `cross-version in-process ${version}`,
      true,
    );
    if (failedTests.length === 0) {
      console.log(`::error title=${title}::suite failed (see logs)`);
      continue;
    }
    for (const testName of failedTests) {
      console.log(
        `::error title=${title}::${escapeWorkflowCommand(testName)} — host HTML differs from current`,
      );
    }
  }

  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (stepSummaryPath !== undefined) {
    const rows = results.map(({ version, ok, failedTests }) => {
      const failures = ok
        ? ""
        : failedTests.length > 0
          ? failedTests.join("<br>")
          : "version failed (see logs)";
      return `| ${escapeMarkdownCell(version)} | ${ok ? "✅" : "❌"} | ${escapeMarkdownCell(failures)} |`;
    });
    appendFileSync(
      stepSummaryPath,
      [
        "## Cross-version in-process tests",
        "",
        "| version | result | failing tests |",
        "| --- | --- | --- |",
        ...rows,
        "",
      ].join("\n"),
    );
  }

  writeGitHubOutput(getFailureLines(results).join("\n"));
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

const main = (): void => {
  const { targets } = readManifest();
  if (targets.length === 0) {
    console.error(
      "[cross-version-inprocess] manifest has no targets — compatibility " +
        "check FAILED without running any versions (see prepare output).",
    );
    process.exit(1);
  }

  rmSync(refDirectory, { recursive: true, force: true });
  mkdirSync(refDirectory, { recursive: true });
  const reference = withGitHubGroup(
    "cross-version in-process reference",
    () => {
      console.log(
        "\n[cross-version-inprocess] ===== current reference (update) =====",
      );
      return runSuite("current", true);
    },
  );

  if (!reference.ok) {
    if (process.env.GITHUB_ACTIONS === "true") {
      reportToGitHub([{ ...reference, version: "current reference" }]);
    }
    console.error(
      "\n[cross-version-inprocess] current reference pass FAILED; " +
        "old-version comparisons were not run.",
    );
    process.exit(1);
  }

  console.log(
    `[cross-version-inprocess] running ${targets.length} version(s): ` +
      targets
        .map((target) => `${target.category}=${target.version}`)
        .join(", "),
  );

  const results = targets.map((target) => ({
    target,
    result: withGitHubGroup(
      `cross-version in-process ${target.version}`,
      () => {
        console.log(
          `\n[cross-version-inprocess] ===== ${target.category} = ${target.version} =====`,
        );
        return runSuite(target.version);
      },
    ),
  }));

  console.log("\n[cross-version-inprocess] summary:");
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
      `\n[cross-version-inprocess] ${failed.length}/${results.length} version(s) FAILED`,
    );
    process.exit(1);
  }
  console.log(
    `\n[cross-version-inprocess] all ${results.length} version(s) passed`,
  );
};

main();
