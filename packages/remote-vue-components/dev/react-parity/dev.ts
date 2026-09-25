/**
 * The corpus comparison in watch mode, against references written first.
 *
 * `vitest dev` alone would run the Vue pass with no references on disk, and off
 * CI `toMatchFileSnapshot` writes a missing one from Vue and passes — so the
 * React pass runs once up front. The references it writes stay as they are
 * while the watcher runs: after changing a scenario, restart to rebuild them.
 *
 * Arguments are split as in `run.ts`: filters narrow both passes, flags go to
 * both.
 */
import {
  corpusConfig,
  environmentFor,
  exclusionsFor,
  packageRoot,
  resetReferences,
  runCorpusPass,
  splitArguments,
} from "./passes.ts";
import { spawnSync } from "node:child_process";

const runnerArguments = splitArguments(process.argv.slice(2));

resetReferences();

const referenceStatus = runCorpusPass("reference", runnerArguments);
if (referenceStatus !== 0) {
  console.error(
    "\nThe reference pass failed. That is a broken harness or a broken visual test, not a Vue divergence.",
  );
  process.exit(referenceStatus);
}

console.log("\n▶ Vue (comparing, watching)\n");
process.exit(
  spawnSync(
    "pnpm",
    [
      "exec",
      "vitest",
      "dev",
      "--config",
      corpusConfig,
      /* What a full run leaves out, so the watcher compares the same thing. */
      ...exclusionsFor("compare", runnerArguments),
      ...runnerArguments.flags,
      ...runnerArguments.filters,
    ],
    {
      cwd: packageRoot,
      stdio: "inherit",
      /*
       * Without the `CI` the one-off comparison sets, under which vitest would
       * not watch. The environment refuses a missing reference on its own.
       */
      env: environmentFor("compare"),
    },
  ).status ?? 1,
);
