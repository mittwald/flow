// JSON-aware merge driver for `package.json` (and `lerna.json`), used by the
// forward-merge cascade (ADR 0004 §3) and by every local merge that touches a
// manifest.
//
// The problem it solves: with fixed versioning, ~16 `package.json` files plus
// `lerna.json` carry the same `version` string, and two branches that have both
// moved since their merge base carry DIFFERENT ones. That divergence is
// mechanical noise, not a real conflict — but every *other* change (a genuine
// dependency bump) must still merge normally, so a blanket `merge=ours` is
// wrong: it would silently drop those.
//
// So the driver resolves the `version` field on its own and hands everything
// else to a plain 3-way merge.
//
// ## Which version wins: the HIGHEST, not "ours"
//
// The driver used to always keep "our" version, which is correct for the
// cascade it was written for (`main → next`, `next → major line`): the higher
// line keeps its own version, and `publish.yml` re-derives it anyway.
//
// It is wrong in the far more common direction — `main` merged INTO a branch
// off it. There "ours" is the feature branch, still on the version it forked
// at, so merging a release commit silently reverted the bump: the manifest went
// back to the old version while the package's `CHANGELOG.md` (which merges
// cleanly, nobody edits it by hand) kept the new entry. No conflict markers, no
// warning. Reproduced twice on #2942, once per release.
//
// Taking the HIGHEST semver instead is right in every direction, because the
// version only ever moves forward on any line:
//
//   main → next        next's `X.(Y+1).0-next.N` > main's `X.Y.Z`   → ours   ✔
//   main → feature     main's release bump       > the fork point   → theirs ✔
//   next → feature     next's newer prerelease   > the fork point   → theirs ✔
//   main → next-based  the next line             > main's stable    → ours   ✔
//
// For the cascade this is not a behaviour change: whenever the driver actually
// runs there, `next`'s version is the higher one, so it still wins and the
// empty-forward-merge property (ADR 0004 §6/§7) is preserved. Note the driver
// runs ONLY when both sides changed the file — when one side is unchanged git
// resolves it without consulting any driver.
//
// git invokes a merge driver as configured in `.gitattributes` +
// `merge.package-json.driver`. This script is wired up as:
//   node .github/scripts/merge-package-json.cjs %O %A %B %L %P
//     %O = common-ancestor ("base") version of the file
//     %A = "our" version — the branch being merged INTO;
//          the merge RESULT must be written back here
//     %B = "their" version — the branch being merged IN
//     %L = conflict marker length, %P = pathname (diagnostics only)
// The driver must exit 0 on a clean merge and non-zero to signal an unresolved
// conflict (which escalates to the sync issue — ADR 0004 §4).
//
// This is a `.cjs` on purpose: the repo's eslint config treats `**/*.cjs` as
// out-of-scope Node tooling, so no lint config is needed for it to pass the
// gate; `prettier` still formats it. The pure helpers are exported so
// `merge-package-json.test.mjs` can cover them.

const { spawnSync } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");

// `prettier-plugin-pkgsort` keeps `version` near the top of every
// `package.json`, and in `lerna.json` it is the only `"version"` key at all, so
// the first match is the top-level field in both.
const VERSION_FIELD = /("version"\s*:\s*)"[^"]*"/;

/**
 * Parse a semver string into its comparable parts. Build metadata (`+…`) is
 * ignored, as semver requires. Returns null for anything that is not a full
 * numeric triple — a `workspace:*` or a dist-tag must not pretend to compare.
 */
function parseSemver(value) {
  if (typeof value !== "string") {
    return null;
  }
  const match =
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(
      value.trim(),
    );
  if (!match) {
    return null;
  }
  return {
    release: [Number(match[1]), Number(match[2]), Number(match[3])],
    // Absent prerelease = the release itself, which outranks any prerelease.
    pre: match[4] === undefined ? null : match[4].split("."),
  };
}

/** Compare two prerelease identifier lists per semver §11.4. */
function comparePre(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1; // a release outranks a prerelease
  if (b === null) return -1;

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i];
    const y = b[i];
    // A shorter set of identifiers, all equal so far, has lower precedence.
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (x === y) continue;

    const xNum = /^\d+$/.test(x);
    const yNum = /^\d+$/.test(y);
    if (xNum && yNum) return Number(x) < Number(y) ? -1 : 1;
    if (xNum !== yNum) return xNum ? -1 : 1; // numeric < alphanumeric
    return x < y ? -1 : 1;
  }
  return 0;
}

/**
 * Compare two semver strings. Unparseable values sort BELOW every parseable one
 * and equal to each other, so `pickVersion` never promotes a non-version.
 *
 * @returns {-1 | 0 | 1}
 */
function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);
  if (!left && !right) return 0;
  if (!left) return -1;
  if (!right) return 1;
  for (let i = 0; i < 3; i++) {
    if (left.release[i] !== right.release[i]) {
      return left.release[i] < right.release[i] ? -1 : 1;
    }
  }
  return comparePre(left.pre, right.pre);
}

/**
 * The version the merged file should carry: the higher of the two sides, with
 * "ours" winning a tie so a merge that decides nothing changes nothing. Returns
 * undefined when neither side is a usable version — the caller then leaves the
 * field alone and lets it merge like any other line.
 *
 * @returns {string | undefined}
 */
function pickVersion(ours, theirs) {
  const winner = compareSemver(theirs, ours) > 0 ? theirs : ours;
  return parseSemver(winner) ? winner : undefined;
}

/** The top-level `version` string of a JSON file, or undefined. */
function versionOf(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).version;
  } catch {
    return undefined;
  }
}

/**
 * Rewrite the top-level `version` string in place. Applied to all three inputs
 * with the SAME value, so a pure version divergence never reaches the 3-way
 * merge and the result already carries the winning version.
 */
function normaliseVersion(file, version) {
  const raw = readFileSync(file, "utf8");
  writeFileSync(
    file,
    raw.replace(VERSION_FIELD, `$1${JSON.stringify(version)}`),
  );
}

function main(argv) {
  const [
    basePath,
    oursPath,
    theirsPath,
    markerSize = "7",
    pathName = "package.json",
  ] = argv;

  const version = pickVersion(versionOf(oursPath), versionOf(theirsPath));
  if (version !== undefined) {
    for (const file of [basePath, oursPath, theirsPath]) {
      normaliseVersion(file, version);
    }
  }

  // Line-based 3-way merge. `git merge-file` writes the result in place into
  // `oursPath` and exits with the number of remaining conflict hunks (0 =
  // clean), or a negative/large status on error. The labels stay neutral: the
  // driver is direction-agnostic and git tells it nothing about the branches.
  const result = spawnSync(
    "git",
    [
      "merge-file",
      `--marker-size=${markerSize}`,
      "-L",
      "ours",
      "-L",
      "base",
      "-L",
      "theirs",
      oursPath,
      basePath,
      theirsPath,
    ],
    { stdio: "inherit" },
  );

  if (result.error || result.status === null) {
    console.error(
      `merge-package-json: git merge-file failed to run for ${pathName}`,
    );
    return 1;
  }

  // status 0 → clean merge (exit 0); status > 0 → unresolved conflict hunks
  // remain → signal a conflict so the cascade escalates (ADR 0004 §4).
  return result.status === 0 ? 0 : 1;
}

module.exports = { compareSemver, parseSemver, pickVersion };

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
