import { major, minor, prerelease, rsort, satisfies, valid } from "semver";

export interface ResolveTargetInput {
  /** `patch` | `minor` | `major` | a dist-tag | an exact version. */
  revision: string;
  /** The version the consumer is on. */
  current: string;
  /** Every published version of the anchor package. */
  versions: string[];
  distTags: Record<string, string>;
}

/**
 * The range a revision keyword bounds the target to.
 *
 * `patch` keeps the current minor, `minor` keeps the current major, `major`
 * accepts anything.
 */
const keywordRange = (
  revision: string,
  current: string,
): string | undefined => {
  switch (revision) {
    case "patch":
      return `${major(current)}.${minor(current)}.x`;
    case "minor":
      return `${major(current)}.x`;
    case "major":
      return "*";
    default:
      return undefined;
  }
};

/**
 * What a revision means, as a concrete published version.
 *
 * Returns `undefined` when the revision cannot be resolved — an unknown
 * keyword, an unknown dist-tag, or an exact version that was never published.
 * It does **not** judge whether the result is an upgrade; the caller compares
 * against `current` and refuses a sideways or downward move.
 *
 * Keyword resolution skips prereleases. The `prerelease(...) === null` filter
 * is defence in depth rather than the mechanism: none of the ranges built here
 * embeds a prerelease tag, and node-semver only matches a prerelease when a
 * comparator carries a matching one — so `satisfies` already excludes them. The
 * filter keeps that true if a range shape or an option ever changes. Only an
 * explicit dist-tag or an exact version reaches a `-next.N`, so `upgrade minor`
 * on the stable line never drifts onto the collection branch.
 */
export const resolveTarget = ({
  revision,
  current,
  versions,
  distTags,
}: ResolveTargetInput): string | undefined => {
  const tagged = distTags[revision];
  if (tagged !== undefined) {
    return tagged;
  }

  if (valid(revision) !== null) {
    return versions.includes(revision) ? revision : undefined;
  }

  const range = keywordRange(revision, current);
  if (range === undefined) {
    return undefined;
  }

  const candidates = versions.filter(
    (version) => prerelease(version) === null && satisfies(version, range),
  );

  return rsort(candidates)[0];
};
