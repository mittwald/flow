import semver from "semver";

export interface SelectedTargetVersion {
  category: string;
  version: string;
}

export interface SelectTargetVersionsOptions {
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

const push = (
  targets: SelectedTargetVersion[],
  category: string,
  version: string | undefined,
): void => {
  if (version && !targets.some((t) => t.version === version)) {
    targets.push({ category, version });
  }
};

/**
 * Offset fallback for a prerelease-only history: no stable release exists yet,
 * so the semver categories have nothing to resolve against. Walks fixed
 * distances back through the candidate list instead.
 */
const selectFromPrereleaseOnlyHistory = (
  candidates: string[],
  offsets: number[],
): SelectedTargetVersion[] => {
  const targets: SelectedTargetVersion[] = [];
  if (candidates.length === 0) {
    return targets;
  }

  push(targets, "previous", candidates[candidates.length - 1]);

  for (const offset of offsets) {
    const index = candidates.length - offset;
    if (index >= 0) {
      push(targets, `offset-${offset}`, candidates[index]);
    }
  }

  return targets;
};

/**
 * Selects the set of previously-published versions to run cross-version smoke
 * tests against. Pure: no I/O. The caller supplies the published version list
 * (from npm) and the exclude list.
 */
export function selectCrossVersionTargetVersions(
  currentVersion: string,
  publishedVersions: string[],
  excludedVersions: string[] = [],
  options: SelectTargetVersionsOptions = {},
): SelectedTargetVersion[] {
  const excluded = new Set(excludedVersions);

  // Valid, non-excluded, strictly-older versions, ascending.
  const allCandidates = publishedVersions
    .filter((v) => semver.valid(v) !== null)
    .filter((v) => !excluded.has(v))
    .filter((v) => semver.lt(v, currentVersion))
    .sort(semver.compare);

  // Targets are STABLE releases only. A prerelease (`-next.*`) is a moving
  // artifact of a line that has not shipped: consumers never pin one, and it
  // carries pre-release breakage that reads as a backwards-compatibility
  // finding. `firstOfLine` in particular would otherwise resolve to
  // `X.Y.0-next.0` instead of the line's first real release `X.Y.0`.
  const candidates = allCandidates.filter((v) => semver.prerelease(v) === null);

  if (candidates.length === 0) {
    return selectFromPrereleaseOnlyHistory(
      allCandidates,
      options.offsets ?? DEFAULT_OFFSETS,
    );
  }

  const targets: SelectedTargetVersion[] = [];
  const currentLine = lineOf(currentVersion);

  // previous: nearest below current
  push(targets, "previous", candidates[candidates.length - 1]);

  // firstOfLine: earliest candidate on the current line
  const currentLineVersions = candidates.filter(
    (v) => lineOf(v) === currentLine,
  );
  push(targets, "firstOfLine", currentLineVersions[0]);

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
      targets,
      "latestOfPreviousLine",
      previousLineVersions[previousLineVersions.length - 1],
    );
  }

  return targets;
}
