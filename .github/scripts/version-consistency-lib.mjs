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
