import semver from "semver";
import { VERSION_SCOPED_TESTS } from "./reusedVisualTests";

/**
 * Whether a reused test should be compared for the given tested version. A test
 * listed in VERSION_SCOPED_TESTS is only comparable from its `fromVersion`
 * onward (its element tree diverges below that); everything else always is. A
 * non-semver version (the `current` reference, or unset) is always comparable.
 *
 * NOTE: this gates the COMPARISON only (it runs inside `testScreenshot`, after
 * `render`). Tests that fail to RENDER on old versions can't be handled here —
 * they are whole-file EXCLUDED_VISUAL_TESTS instead.
 */
export const isTestComparable = (
  testName: string,
  version: string,
): boolean => {
  if (semver.valid(version) === null) {
    return true;
  }
  const rule = VERSION_SCOPED_TESTS.find(
    (candidate) => candidate.testName === testName,
  );
  return rule === undefined || !semver.lt(version, rule.fromVersion);
};
