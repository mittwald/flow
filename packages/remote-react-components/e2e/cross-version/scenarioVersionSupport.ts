import semver from "semver";
import { scenarioVersionRules } from "./scenarioVersionRules";

/**
 * Whether a scenario should be compared for the given tested version. Scenarios
 * with no rule (see `scenarioVersionRules.ts`) are always comparable. A
 * non-semver version (the `current` sentinel, or unset) is always comparable.
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
