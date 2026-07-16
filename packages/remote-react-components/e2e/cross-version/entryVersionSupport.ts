import semver from "semver";

/**
 * Version-support rules for the visual scenarios in the cross-version harness.
 *
 * By default every scenario is compared against every installed old version.
 * Some scenarios only render the same as current from a certain version onward
 * — e.g. a component's output structure evolved — and would otherwise flag a
 * non-regression. Express that positively with `minVersion` ("this entry is
 * only comparable from version X onward"); older versions are skipped. Use
 * `skipVersions` for one-off exceptions (a specific intermediate release to
 * skip). Scenarios with no rule are always compared.
 *
 * This is the scenario-level analogue of `cross-version.exclude.json` (which
 * excludes whole broken published versions).
 */
export interface ScenarioVersionRule {
  /** Scenario module basename, as the host test derives it. */
  scenarioFile: string;
  scenarioName: string;
  /**
   * Only compare this scenario for old versions `>=` this one (the component it
   * exercises reached its current shape here). Older versions are skipped.
   */
  minVersion?: string;
  /** One-off versions to skip regardless of `minVersion`. */
  skipVersions?: string[];
  reason: string;
}

export const scenarioVersionRules: ScenarioVersionRule[] = [
  {
    scenarioFile: "Button.scenarios.tsx",
    scenarioName: "Button colors",
    minVersion: "0.2.0-alpha.791",
    reason:
      "AccentBox backgroundColor handling evolved: <= alpha.686 render a `--neutral` class variant, later versions render a custom color as an inline style. Comparable from alpha.791 onward.",
  },
];

/**
 * Whether a scenario should be compared for the given tested version. Scenarios
 * with no rule are always comparable. A non-semver version (the `current`
 * sentinel, or unset) is always comparable.
 */
export const isScenarioComparable = (
  scenarioFile: string,
  scenarioName: string,
  version: string,
): boolean => {
  if (semver.valid(version) === null) {
    return true;
  }
  const rule = scenarioVersionRules.find(
    (candidate) =>
      candidate.scenarioFile === scenarioFile &&
      candidate.scenarioName === scenarioName,
  );
  if (!rule) {
    return true;
  }
  if (rule.skipVersions?.includes(version)) {
    return false;
  }
  if (rule.minVersion !== undefined && semver.lt(version, rule.minVersion)) {
    return false;
  }
  return true;
};
