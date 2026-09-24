/**
 * The passes the parity runners are made of, shared by `run.ts` (what CI runs)
 * and `dev.ts` (the watch loop).
 */
import {
  excludeUnsupportedFiles,
  excludeUnsupportedPattern,
} from "../../e2e/react-parity/knownGaps.ts";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const packageRoot = path.resolve(here, "../..");
export const corpusConfig = "e2e/react-parity/vitest.config.ts";
export const listConfig = "e2e/list-parity/vitest.config.ts";

export type PassMode = "reference" | "compare";

export interface RunnerArguments {
  /** Vitest flags, forwarded to every vitest invocation. */
  flags: string[];
  /** Positional file filters, naming corpus scenarios. */
  filters: string[];
}

/**
 * Splits what the runner was handed into flags and filters.
 *
 * A flag starts with `-` and goes to every pass, the List harness included:
 * `pnpm affected:test:browser --parallel=1 --browser.name=webkit` hands the
 * same flags to every target it runs, and treating `--browser.name=webkit` as a
 * filter dropped the Vue pass's exclusions and skipped the List harness. A
 * flag's value has to be spelled with `=` — a separate value would read as a
 * filter.
 */
export const splitArguments = (argv: readonly string[]): RunnerArguments => ({
  flags: argv.filter((argument) => argument.startsWith("-")),
  filters: argv.filter((argument) => !argument.startsWith("-")),
});

/*
 * Rebuilt every run. A committed reference would become a second source of
 * truth: the claim is "Vue renders what React renders today", not "what React
 * rendered when someone last updated a file".
 */
export const resetReferences = (): void => {
  rmSync(path.join(packageRoot, "e2e/react-parity/.refs"), {
    recursive: true,
    force: true,
  });
};

/**
 * What each pass does with a missing file snapshot: the reference pass writes
 * it, the comparison has to fail on it.
 *
 * Stated as a flag, not as an environment variable. Vitest derives the default
 * from whether it believes it is on CI, and that is not just `CI` — `std-env`
 * recognises `GITHUB_ACTIONS` and every other provider's marker too. Unsetting
 * `CI` therefore changed nothing on the runner, and the pass that is supposed
 * to write all 187 references failed all 187 instead.
 *
 * `--update=true`, not a bare `--update`: the flag's value is optional, so a
 * bare one swallows the positional test filter that follows it and the run
 * silently widens to the whole corpus.
 */
const snapshotArgumentsFor = (mode: PassMode): string[] =>
  mode === "reference" ? ["--update=true"] : [];

/** Which pass the harness's vite config builds for. */
export const environmentFor = (mode: PassMode): NodeJS.ProcessEnv => ({
  ...process.env,
  FLOW_PARITY_MODE: mode,
});

/*
 * The comparison must not write what it failed to find. A missing reference
 * means the reference pass never reached that scenario, and
 * `toMatchFileSnapshot` would otherwise create it and report a pass — the one
 * outcome that looks like parity and proves nothing. `CI` is what makes vitest
 * refuse to write; the environment also refuses on its own (see
 * `environments.ts`), so a comparison started without this runner fails too.
 */
const passEnvironmentFor = (mode: PassMode): NodeJS.ProcessEnv => ({
  ...environmentFor(mode),
  ...(mode === "compare" ? { CI: "true" } : {}),
});

/*
 * The Vue pass skips what cannot be expressed in Vue at all. Filtered by name
 * rather than swallowed in the environment: several of those scenarios
 * interact with what they rendered, so a half-run leaves them timing out on an
 * empty page instead of reporting the reason. Applied under a file filter too,
 * so a filtered run compares what a full run compares — except when the flags
 * bring a test-name pattern of their own, which asks for scenarios by name and
 * would collide with this one.
 */
const namesScenarios = (flags: readonly string[]): boolean =>
  flags.some(
    (flag) =>
      flag === "-t" ||
      flag.startsWith("-t=") ||
      flag.startsWith("--testNamePattern"),
  );

const exclusionsFor = (mode: PassMode, { flags }: RunnerArguments) =>
  mode === "compare" && !namesScenarios(flags)
    ? [...excludeUnsupportedFiles(), "-t", excludeUnsupportedPattern()]
    : [];

export const runCorpusPass = (
  mode: PassMode,
  runnerArguments: RunnerArguments,
  extraArguments: readonly string[] = [],
): number => {
  console.log(
    `\n▶ ${mode === "reference" ? "React (writing references)" : "Vue (comparing)"}\n`,
  );
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "vitest",
      "run",
      "--config",
      corpusConfig,
      "--browser.headless",
      ...snapshotArgumentsFor(mode),
      ...exclusionsFor(mode, runnerArguments),
      ...extraArguments,
      ...runnerArguments.flags,
      ...runnerArguments.filters,
    ],
    { cwd: packageRoot, stdio: "inherit", env: passEnvironmentFor(mode) },
  );
  return result.status ?? 1;
};

export const runListParity = ({ flags }: RunnerArguments): number => {
  console.log("\n▶ The List, written once per binding\n");
  return (
    spawnSync(
      "pnpm",
      [
        "exec",
        "vitest",
        "run",
        "--config",
        listConfig,
        "--browser.headless",
        ...flags,
      ],
      { cwd: packageRoot, stdio: "inherit", env: process.env },
    ).status ?? 1
  );
};
