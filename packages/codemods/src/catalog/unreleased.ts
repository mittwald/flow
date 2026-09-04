import { compare } from "semver";

/**
 * The `since` an entry carries while its release version is unknown.
 *
 * A `feat:` PR lands on `next` and is promoted later, in a bundle whose stable
 * `x.y.0` depends on what else is promoted with it — the author cannot know
 * that number, not even approximately (#2890). They write `since: UNRELEASED`;
 * `/prepare-release` rewrites it to the graduated version while it builds the
 * release branch, and a guard there fails the promotion if one survives.
 *
 * The placeholder is `next`-only. A `fix:` PR on `main` still knows its version
 * the way it always did (last published, `>=` the next patch), and nothing on
 * that path resolves a placeholder — `publish.yml` releases it, not
 * `/prepare-release`.
 *
 * It reaches consumers, though: every push to `next` publishes `X.Y.0-next.N`,
 * placeholder and all. So the CLI has to treat the literal as a version rather
 * than hand it to `semver`, which throws on it.
 */
export const unreleasedSince = "UNRELEASED";

export const isUnreleased = (since: string): boolean =>
  since === unreleasedSince;

/**
 * `semver.compare` over `since`, sorting an unreleased entry above every real
 * version.
 *
 * Unreleased is by definition newer than anything published: the entry ships
 * under a stable version that does not exist yet, and the only channel carrying
 * it is a prerelease of exactly that version.
 */
export const compareSince = (a: string, b: string): number => {
  if (isUnreleased(a)) {
    return isUnreleased(b) ? 0 : 1;
  }
  if (isUnreleased(b)) {
    return -1;
  }
  return compare(a, b);
};
