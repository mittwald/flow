/**
 * Runs the visual corpus twice: once from React to write the references, once
 * from Vue to compare against them.
 *
 * Two processes rather than two environments in one run, because the reused
 * tests locate what they interact with through `page.getByRole(…)` — which has
 * to find exactly one tree.
 *
 * Positional arguments are file filters and narrow both corpus passes; flags
 * (`--browser.name=webkit`) go to every vitest invocation — see
 * `splitArguments`.
 */
import {
  packageRoot,
  resetReferences,
  runCorpusPass,
  runListParity,
  splitArguments,
} from "./passes.ts";
import { readCorpus, staleKnownGaps } from "./staleKnownGaps.ts";
import {
  unsupportedFiles,
  unsupportedScenarios,
} from "../../e2e/react-parity/knownGaps.ts";
import path from "node:path";

const runnerArguments = splitArguments(process.argv.slice(2));
const isFullRun = runnerArguments.filters.length === 0;

/*
 * The reference pass's own report, next to the references it wrote and reset
 * with them. Only a full run reports the whole corpus, so only a full run
 * checks the known gaps against it.
 */
const reportPath = path.join(
  packageRoot,
  "e2e/react-parity/.refs/reference-report.json",
);

resetReferences();

const referenceStatus = runCorpusPass(
  "reference",
  runnerArguments,
  isFullRun
    ? [
        "--reporter=default",
        "--reporter=json",
        `--outputFile.json=${reportPath}`,
      ]
    : [],
);
if (referenceStatus !== 0) {
  console.error(
    "\nThe reference pass failed. That is a broken harness or a broken visual test, not a Vue divergence.",
  );
  process.exit(referenceStatus);
}

const staleEntries = isFullRun ? staleKnownGaps(readCorpus(reportPath)) : [];

const compareStatus = runCorpusPass("compare", runnerArguments);

/*
 * The hand-written half of the parity story: the corpus above cannot express
 * Flow's `List` — its scenarios build one with `typedList<T>()` and a React
 * component of their own — so the List is written once per binding and compared
 * the same way, by its own harness. Skipped when a filter was given, because
 * the filter names a corpus scenario.
 */
const listParityStatus = isFullRun ? runListParity(runnerArguments) : 0;

console.log("\nNot compared — cannot be expressed in Vue:");
for (const [file, reason] of Object.entries(unsupportedFiles)) {
  console.log(`  · ${file} (whole file) — ${reason}`);
}
for (const [name, reason] of Object.entries(unsupportedScenarios)) {
  console.log(`  · ${name} — ${reason}`);
}

if (staleEntries.length > 0) {
  console.error(
    "\nknownGaps.ts names what the corpus no longer has. Delete or rename these entries:",
  );
  for (const entry of staleEntries) {
    console.error(`  · ${entry}`);
  }
}

process.exit(
  compareStatus || listParityStatus || (staleEntries.length > 0 ? 1 : 0),
);
