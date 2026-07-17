import semver from "semver";

export interface ReusedVisualTestVersionRule {
  /** Full Vitest test name, including the CrossVersion parameter. */
  testName: string;
  minVersion?: string;
  skipVersions?: string[];
  reason: string;
}

export const reusedVisualTestVersionRules: ReusedVisualTestVersionRule[] = [];

export const isTestComparable = (
  testName: string,
  version: string,
): boolean => {
  if (semver.valid(version) === null) {
    return true;
  }

  const rule = reusedVisualTestVersionRules.find(
    (candidate) => candidate.testName === testName,
  );
  if (rule === undefined) {
    return true;
  }
  if (rule.skipVersions?.includes(version)) {
    return false;
  }
  return rule.minVersion === undefined || !semver.lt(version, rule.minVersion);
};
