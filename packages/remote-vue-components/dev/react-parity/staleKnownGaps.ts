/**
 * Known gaps that no longer name anything in the corpus.
 *
 * An entry is matched by name, so one whose scenario was renamed or removed
 * stops applying without a word: an unsupported entry keeps its exemption for
 * nothing, and a diverging one is never consulted. The reference pass runs the
 * whole corpus, so its report is the list every entry has to be on.
 */
import {
  divergingScenarios,
  scenarioNameOf,
  unsupportedFiles,
  unsupportedScenarios,
} from "../../e2e/react-parity/knownGaps.ts";
import { readFileSync } from "node:fs";
import path from "node:path";

/** The part of vitest's JSON report this reads. */
interface VitestJsonReport {
  testResults: {
    name: string;
    assertionResults: { fullName: string }[];
  }[];
}

export interface Corpus {
  /** Test file basenames. */
  files: ReadonlySet<string>;
  /** Scenario names, without the environment's label. */
  scenarios: ReadonlySet<string>;
}

export const readCorpus = (reportPath: string): Corpus => {
  const report = JSON.parse(
    readFileSync(reportPath, "utf8"),
  ) as VitestJsonReport;

  return {
    files: new Set(report.testResults.map((file) => path.basename(file.name))),
    scenarios: new Set(
      report.testResults.flatMap((file) =>
        file.assertionResults.map((test) => scenarioNameOf(test.fullName)),
      ),
    ),
  };
};

export const staleKnownGaps = (corpus: Corpus): string[] => [
  ...Object.keys(unsupportedFiles)
    .filter((file) => !corpus.files.has(file))
    .map((file) => `unsupportedFiles: no corpus file "${file}"`),
  ...Object.keys(unsupportedScenarios)
    .filter((name) => !corpus.scenarios.has(name))
    .map((name) => `unsupportedScenarios: no corpus scenario "${name}"`),
  ...Object.keys(divergingScenarios)
    .filter((name) => !corpus.scenarios.has(name))
    .map((name) => `divergingScenarios: no corpus scenario "${name}"`),
];
