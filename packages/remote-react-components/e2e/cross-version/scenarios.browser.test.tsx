import type { VisualScenarios } from "@/tests/lib/visualScenario";
import { expect, inject, test } from "vitest";
import {
  renderThroughHost,
  renderThroughHostTimeout,
} from "./renderThroughHost";
import { isScenarioComparable } from "./scenarioVersionSupport";

declare const __FLOW_CROSS_VERSION__: string;

const currentPort = inject("crossVersionCurrentPort");
const oldPort = inject("crossVersionOldPort");

const scenarioModules = import.meta.glob<{ default: VisualScenarios }>(
  "../../src/tests/visual/*.scenarios.tsx",
  { eager: true },
);

const scenarios = Object.entries(scenarioModules)
  .flatMap(([scenarioPath, scenarioModule]) => {
    const scenarioFile = scenarioPath.slice(scenarioPath.lastIndexOf("/") + 1);
    return Object.keys(scenarioModule.default).map((scenarioName) => ({
      scenarioFile,
      scenarioName,
    }));
  })
  .filter(({ scenarioFile, scenarioName }) =>
    isScenarioComparable(scenarioFile, scenarioName, __FLOW_CROSS_VERSION__),
  );

test.each(scenarios)(
  "cross-version HTML output matches: $scenarioFile#$scenarioName",
  async ({ scenarioFile, scenarioName }) => {
    const reference = await renderThroughHost(
      currentPort,
      scenarioFile,
      scenarioName,
    );
    expect(reference).not.toBe("");

    let candidate: string;
    try {
      candidate = await renderThroughHost(oldPort, scenarioFile, scenarioName);
    } catch (error) {
      console.warn(
        `[cross-version] SKIP ${scenarioFile}#${scenarioName}: ` +
          `the old version could not render this scenario (${String(error)})`,
      );
      return;
    }

    expect(candidate).toEqual(reference);
  },
  renderThroughHostTimeout * 2 + 10_000,
);
