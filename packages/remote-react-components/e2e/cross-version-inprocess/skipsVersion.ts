// The version rules behind `crossVersion`, kept free of any import that only
// resolves inside the prepared harness so a unit test can reach them.
import semver from "semver";

export interface CrossVersionSkip {
  /** Skip when the tested version is older than this (semver). */
  below?: string;
  /** Skip these exact versions (for non-monotonic breakage). */
  exclude?: string[];
  /**
   * Skip every version in this semver range. What `below` cannot express: a fix
   * that reached `main` after the next line branched, so the versions published
   * on that line in between sort above the threshold without carrying it.
   */
  excludeRange?: string;
}

/**
 * Whether the tested version is skipped. A non-semver version — the `current`
 * reference pass — never is, so every test writes its reference.
 */
export const skipsVersion = (
  version: string,
  { below, exclude, excludeRange }: CrossVersionSkip,
): boolean => {
  if (semver.valid(version) === null) {
    return false;
  }
  if (below !== undefined && semver.lt(version, below)) {
    return true;
  }
  if (
    excludeRange !== undefined &&
    // A prerelease only satisfies a range bound of a different version tuple
    // with this flag, and every next-line version is a prerelease.
    semver.satisfies(version, excludeRange, { includePrerelease: true })
  ) {
    return true;
  }
  return exclude?.includes(version) ?? false;
};
