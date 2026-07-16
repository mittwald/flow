import semver from "semver";

export interface ResolvedTarget {
  category: string;
  version: string;
}

export interface ResolveOptions {
  /** Index offsets (versions back) used in the prerelease fallback. */
  offsets?: number[];
}

const DEFAULT_OFFSETS = [10, 100, 200];

/** Major.minor of a version (release line), ignoring patch and prerelease tag. */
const lineOf = (version: string): string => {
  const parsed = semver.parse(version);
  if (!parsed) {
    return version;
  }
  return `${parsed.major}.${parsed.minor}`;
};

/**
 * Resolves the set of previously-published versions to run cross-version smoke
 * tests against. Pure: no I/O. The caller supplies the published version list
 * (from npm) and the exclude list.
 */
export function resolveCrossVersionTargets(
  currentVersion: string,
  publishedVersions: string[],
  excludedVersions: string[] = [],
  options: ResolveOptions = {},
): ResolvedTarget[] {
  const excluded = new Set(excludedVersions);

  // Valid, non-excluded, strictly-older versions, ascending.
  const candidates = publishedVersions
    .filter((v) => semver.valid(v) !== null)
    .filter((v) => !excluded.has(v))
    .filter((v) => semver.lt(v, currentVersion))
    .sort(semver.compare);

  if (candidates.length === 0) {
    return [];
  }

  const push = (
    targets: ResolvedTarget[],
    category: string,
    version: string | undefined,
  ): void => {
    if (version && !targets.some((t) => t.version === version)) {
      targets.push({ category, version });
    }
  };

  // --- semver categories ---
  const semverTargets: ResolvedTarget[] = [];
  const currentLine = lineOf(currentVersion);

  // previous: nearest below current
  push(semverTargets, "previous", candidates[candidates.length - 1]);

  // firstOfLine: earliest candidate on the current line
  const currentLineVersions = candidates.filter(
    (v) => lineOf(v) === currentLine,
  );
  push(semverTargets, "firstOfLine", currentLineVersions[0]);

  // latestOfPreviousLine: latest candidate on the highest line strictly below currentLine
  const previousLine = candidates
    .map(lineOf)
    .filter((line) => semver.lt(`${line}.0`, `${currentLine}.0`))
    .sort((a, b) => semver.compare(`${a}.0`, `${b}.0`))
    .pop();
  if (previousLine) {
    const previousLineVersions = candidates.filter(
      (v) => lineOf(v) === previousLine,
    );
    push(
      semverTargets,
      "latestOfPreviousLine",
      previousLineVersions[previousLineVersions.length - 1],
    );
  }

  // --- alpha/prerelease fallback ---
  if (!semver.prerelease(currentVersion)) {
    return semverTargets;
  }

  const hasLatestOfPreviousLine = semverTargets.some(
    (t) => t.category === "latestOfPreviousLine",
  );
  if (hasLatestOfPreviousLine) {
    return semverTargets;
  }

  const offsets = options.offsets ?? DEFAULT_OFFSETS;
  const offsetTargets: ResolvedTarget[] = [];

  // previous still makes sense in prerelease mode
  push(offsetTargets, "previous", candidates[candidates.length - 1]);

  for (const offset of offsets) {
    const index = candidates.length - offset;
    if (index >= 0) {
      push(offsetTargets, `offset-${offset}`, candidates[index]);
    }
  }

  return offsetTargets;
}
