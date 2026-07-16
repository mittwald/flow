import semver from "semver";

/**
 * Version-support rules for the reused e2e entries in the cross-version
 * harness.
 *
 * By default every entry is compared against every installed old version. Some
 * entries only render the same as current from a certain version onward — e.g.
 * a component's output structure evolved — and would otherwise flag a
 * non-regression. Express that positively with `minVersion` ("this entry is
 * only comparable from version X onward"); older versions are skipped. Use
 * `skipVersions` for one-off exceptions (a specific intermediate release to
 * skip). Entries with no rule are always compared.
 *
 * This is the entry-level analogue of `cross-version.exclude.json` (which
 * excludes whole broken published versions).
 */
export interface EntryVersionRule {
  /** Entry file, as the host test derives it: leading-slash, no `../tests`. */
  entryFile: string;
  exportName: string;
  /**
   * Only compare this entry for old versions `>=` this one (the component it
   * exercises reached its current shape here). Older versions are skipped.
   */
  minVersion?: string;
  /** One-off versions to skip regardless of `minVersion`. */
  skipVersions?: string[];
  reason: string;
}

export const entryVersionRules: EntryVersionRule[] = [
  {
    entryFile: "/Modal.browser.test.remote.tsx",
    exportName: "inList",
    minVersion: "0.2.0-alpha.883",
    reason:
      "List gained an always-present, visually-hidden empty-view wrapper between alpha.791 and alpha.883; older versions render List without it, so the host HTML differs. Comparable from alpha.883 onward.",
  },
];

/**
 * Whether an entry should be compared for the given tested version. Entries
 * with no rule are always comparable. A non-semver version (the `current`
 * sentinel, or unset) is always comparable.
 */
export const isEntryComparable = (
  entryFile: string,
  exportName: string,
  version: string,
): boolean => {
  if (semver.valid(version) === null) {
    return true;
  }
  const rule = entryVersionRules.find(
    (candidate) =>
      candidate.entryFile === entryFile && candidate.exportName === exportName,
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
