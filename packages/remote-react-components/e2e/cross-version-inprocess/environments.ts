// Injected in place of `@/tests/lib/environments` so unmodified visual tests
// run only under the in-process CrossVersion environment.
import semver from "semver";
import { crossVersionEnvironment } from "./crossVersionEnvironment";

export const testEnvironments = [crossVersionEnvironment] as const;

declare const __FLOW_CROSS_VERSION__: string;

export interface CrossVersionSkip {
  /** Skip when the tested version is older than this (semver). */
  below?: string;
  /** Skip these exact versions (for non-monotonic breakage). */
  exclude?: string[];
  /**
   * Skip versions inside this semver range, prereleases included. For a fix
   * that reached release lines at different versions, e.g. a forward-merge into
   * `next`.
   */
  excludeRange?: string;
}

/**
 * Skip predicate for version-bound reused tests: a test wrapped in
 * `test.skipIf(crossVersion({ below: "<v>" }))` is skipped when this run tests
 * a published version older than `<v>` — either the component it uses didn't
 * exist yet, or the element tree the current host builds from that version's
 * output genuinely differs. `exclude` skips specific versions and
 * `excludeRange` a semver range, both for non-monotonic breakage. The `current`
 * reference pass (non-semver) never skips, so every test writes its reference.
 */
export const crossVersion = ({
  below,
  exclude,
  excludeRange,
}: CrossVersionSkip): boolean => {
  const version = __FLOW_CROSS_VERSION__;
  if (semver.valid(version) === null) {
    return false;
  }
  if (below !== undefined && semver.lt(version, below)) {
    return true;
  }
  if (
    excludeRange !== undefined &&
    semver.satisfies(version, excludeRange, { includePrerelease: true })
  ) {
    return true;
  }
  return exclude?.includes(version) ?? false;
};
