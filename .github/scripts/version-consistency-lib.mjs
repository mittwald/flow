// @ts-check
/**
 * Version-consistency classification — pure functions, no git / no IO.
 *
 * Fixed versioning (`lerna.json` has no `"independent"`) means every package
 * Lerna-Lite manages carries the SAME `version` string as `lerna.json` itself.
 * Nothing enforced that, so a manifest could silently fall behind — which is
 * exactly what the `merge=package-json` driver used to do on a feature branch
 * that merged a release commit (see `merge-package-json.cjs`). A stale version
 * in a published package's manifest is not cosmetic: `lerna publish
 * from-package` ships what the manifest says.
 *
 * @typedef {{ path: string; version: unknown }} Manifest
 *
 * @typedef {{ path: string; version: string; expected: string }} Mismatch
 *
 * @typedef {{ kind: "write"; mismatches: Mismatch[] }
 *   | { kind: "refuse"; reason: string }} FixPlan
 */

/**
 * Translate one `lerna.json` `packages` glob into an anchored RegExp matching a
 * package DIRECTORY. Only the two shapes lerna globs actually use are
 * supported: `*` (one path segment) and `**` (any number).
 *
 * @param {string} pattern
 * @returns {RegExp}
 */
export function globToRegExp(pattern) {
  // One pass, so the alternatives cannot rewrite each other's output: `**`
  // before `*`, and every regex metacharacter escaped where it stands.
  const source = pattern.replace(/\*\*|\*|[.+^${}()|[\]\\]/g, (token) => {
    if (token === "**") return ".*";
    if (token === "*") return "[^/]*";
    return `\\${token}`;
  });
  return new RegExp(`^${source}$`);
}

/**
 * True when `dir` is a package directory covered by the `lerna.json` globs.
 *
 * @param {string} dir
 * @param {string[]} patterns
 */
export function isLernaPackageDir(dir, patterns) {
  return patterns.some((pattern) => globToRegExp(pattern).test(dir));
}

/**
 * Every manifest whose version disagrees with `lerna.json`. A missing version
 * counts as a mismatch — lerna maintains one for every package it manages.
 *
 * @param {string} lernaVersion
 * @param {Manifest[]} manifests
 * @returns {Mismatch[]}
 */
export function collectMismatches(lernaVersion, manifests) {
  /** @type {Mismatch[]} */
  const mismatches = [];
  for (const { path, version } of manifests) {
    if (version === lernaVersion) continue;
    mismatches.push({
      path,
      version: typeof version === "string" ? version : "(none)",
      expected: lernaVersion,
    });
  }
  return mismatches;
}

/**
 * What `--fix` should do about a set of mismatches.
 *
 * Writing the packages is right when `lerna.json` is the one telling the truth,
 * which is the usual case: a release bumped everything and a forward-merge
 * could not reach a package that exists only on this branch.
 *
 * It is wrong in one shape, and that shape looks identical from a single
 * manifest: when EVERY managed package agrees on a version and only
 * `lerna.json` differs, the file left behind is `lerna.json`. Writing then
 * drags every package backwards to a release that was already published. There
 * is no way to tell which side is right from the versions alone, so the fix
 * refuses and says what it saw.
 *
 * @param {string} lernaVersion
 * @param {Manifest[]} manifests
 * @returns {FixPlan}
 */
export function planFix(lernaVersion, manifests) {
  const mismatches = collectMismatches(lernaVersion, manifests);

  if (mismatches.length === 0) {
    return { kind: "write", mismatches };
  }

  if (mismatches.length === manifests.length) {
    const agreed = new Set(mismatches.map(({ version }) => version));

    if (agreed.size === 1) {
      const [only] = [...agreed];
      return {
        kind: "refuse",
        reason:
          `every managed package is at ${only} and only lerna.json says ` +
          `${lernaVersion}. That is lerna.json left behind, not the packages — ` +
          "fixing it this way would undo a release. Set lerna.json to " +
          `${only}, or work out which version this branch should be on.`,
      };
    }
  }

  return { kind: "write", mismatches };
}

/**
 * The manifest text with its `version` replaced.
 *
 * A targeted replacement rather than a parse-and-serialize: a manifest is a
 * file people read and diff, and `JSON.stringify` would reformat every line of
 * it. Only the first `"version"` at the top level is touched — a nested one (a
 * dependency called `version`, a `volta` pin) sits deeper and is indented
 * further.
 *
 * @param {string} source
 * @param {string} nextVersion
 * @returns {string}
 */
export function withVersion(source, nextVersion) {
  const pattern = /^(\s{2}"version":\s*")[^"]*(")/m;

  if (!pattern.test(source)) {
    throw new Error("No top-level `version` field to replace.");
  }

  return source.replace(pattern, `$1${nextVersion}$2`);
}
