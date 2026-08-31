import { lt, major, minor, prerelease, rsort, satisfies, valid } from "semver";

export interface ResolveTargetInput {
  /** `patch` | `minor` | `major` | a dist-tag | an exact version. */
  revision: string;
  /** The version the consumer is on. */
  current: string;
  /** Every published version of the anchor package. */
  versions: string[];
  distTags: Record<string, string>;
}

export type KeywordRevision = "patch" | "minor" | "major";

const KEYWORDS: readonly KeywordRevision[] = ["patch", "minor", "major"];

const isKeyword = (revision: string): revision is KeywordRevision =>
  (KEYWORDS as readonly string[]).includes(revision);

/**
 * Why `resolveTarget` could not turn `revision` into a version — the caller
 * needs this to say something more useful than "could not resolve", because the
 * four cases below call for genuinely different messages (unknown input, a real
 * keyword with nothing to point at, an unknown dist-tag, an unpublished exact
 * version).
 */
export type UnresolvedTarget =
  | {
      kind: "unrecognized";
      revision: string;
      /** The dist-tags that do exist, so the caller can name them. */
      distTags: string[];
    }
  | {
      kind: "no-candidate";
      revision: KeywordRevision;
      /** What the keyword was looking for, in prose ("the highest …"). */
      describes: string;
      /**
       * The next broader keyword and what it resolves to, when one exists —
       * `major` has none, it is already unbounded. Naming this beats hardcoding
       * "use major": a `patch` failure's real escape is `minor`.
       */
      broader?: { keyword: KeywordRevision; target: string };
    }
  | {
      kind: "unpublished";
      revision: string;
      /** The nearest published version, when `versions` is non-empty. */
      closest: string | undefined;
    };

export type ResolveTargetResult =
  { ok: true; target: string } | { ok: false; reason: UnresolvedTarget };

/**
 * The range a revision keyword bounds the target to.
 *
 * `patch` keeps the current minor, `minor` keeps the current major, `major`
 * accepts anything.
 */
const keywordRange = (revision: KeywordRevision, current: string): string => {
  switch (revision) {
    case "patch":
      return `${major(current)}.${minor(current)}.x`;
    case "minor":
      return `${major(current)}.x`;
    case "major":
      return "*";
  }
};

/** Prose for what a keyword looks for — used in the "no-candidate" message. */
const describeKeyword = (
  revision: KeywordRevision,
  current: string,
): string => {
  switch (revision) {
    case "patch":
      return `the highest published patch release on ${major(current)}.${minor(current)}.x`;
    case "minor":
      return `the highest published stable release in ${major(current)}.x`;
    case "major":
      return "the highest published stable release";
  }
};

/**
 * The highest stable version satisfying `range`, or `undefined`.
 *
 * The `prerelease(...) === null` filter is defence in depth rather than the
 * mechanism: none of the ranges built here embeds a prerelease tag, and
 * node-semver only matches a prerelease when a comparator carries a matching
 * one — so `satisfies` already excludes them. The filter keeps that true if a
 * range shape or an option ever changes.
 */
const highestStable = (
  range: string,
  versions: string[],
): string | undefined => {
  const candidates = versions.filter(
    (version) => prerelease(version) === null && satisfies(version, range),
  );
  return rsort(candidates)[0];
};

/**
 * The next keyword broader than `revision`, and what it resolves to.
 *
 * `patch` is bounded to the current minor, `minor` to the current major — each
 * has exactly one broader step. `major` is already unbounded, so it has none.
 * This is what turns "use major" into a suggestion the caller can act on
 * directly, and what stops a `patch` failure suggesting `major` when `minor`
 * would already have found something.
 */
const broaderCandidate = (
  revision: KeywordRevision,
  current: string,
  versions: string[],
): { keyword: KeywordRevision; target: string } | undefined => {
  const index = KEYWORDS.indexOf(revision);
  for (let i = index + 1; i < KEYWORDS.length; i++) {
    const keyword = KEYWORDS[i];
    if (keyword === undefined) {
      continue;
    }
    const target = highestStable(keywordRange(keyword, current), versions);
    if (target !== undefined) {
      return { keyword, target };
    }
  }
  return undefined;
};

/**
 * What a revision means, as a concrete published version — or a structured
 * reason it does not.
 *
 * Reports the resolution rather than judging it: it does **not** judge whether
 * the result is an upgrade; the caller compares against `current` and refuses a
 * sideways or downward move.
 *
 * Keyword resolution skips prereleases (see `highestStable`). Only an explicit
 * dist-tag or an exact version reaches a `-next.N`, so `upgrade minor` on the
 * stable line never drifts onto the collection branch.
 */
export const resolveTarget = ({
  revision,
  current,
  versions,
  distTags,
}: ResolveTargetInput): ResolveTargetResult => {
  const tagged = distTags[revision];
  if (tagged !== undefined) {
    return { ok: true, target: tagged };
  }

  if (valid(revision) !== null) {
    if (versions.includes(revision)) {
      return { ok: true, target: revision };
    }

    const sorted = rsort(versions);
    const closest =
      sorted.find((version) => lt(version, revision)) ?? sorted.at(-1);
    return { ok: false, reason: { kind: "unpublished", revision, closest } };
  }

  if (!isKeyword(revision)) {
    return {
      ok: false,
      reason: {
        kind: "unrecognized",
        revision,
        distTags: Object.keys(distTags),
      },
    };
  }

  const target = highestStable(keywordRange(revision, current), versions);
  if (target !== undefined) {
    return { ok: true, target };
  }

  return {
    ok: false,
    reason: {
      kind: "no-candidate",
      revision,
      describes: describeKeyword(revision, current),
      broader: broaderCandidate(revision, current, versions),
    },
  };
};
