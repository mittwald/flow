// @ts-check
/**
 * Publish-completeness classification — pure functions, no fs / no network.
 *
 * Fixed versioning ships all publishable packages as one release. A release
 * that lands only some of them is not a smaller release: `workspace:*` becomes
 * an EXACT pin at pack time, so a package that did publish can demand a version
 * that does not exist. `@mittwald/flow-remote-react-components@1.1.31` pins
 * `@mittwald/flow-remote-elements@1.1.31`, which the 1.1.31 run dropped —
 * installing it fails with `ETARGET` (#2887).
 *
 * Such a hole is silent by construction. `lerna publish` treats npm's `409
 * Failed to save packument` — the answer to a CONCURRENT write on the same
 * package document — as "already published", warns, and exits 0 (lerna-lite
 * `is-npm-js-publish-version-conflict.js`). The run is green, the tag and the
 * GitHub release are cut, and the hole surfaces months later in a consumer's
 * install. This module classifies what the registry answers so the run can go
 * red instead.
 *
 * @typedef {{ name: unknown; version: unknown; private?: unknown }} Manifest
 *
 * @typedef {{ path: string; name: string; version: string }} Publishable
 *
 * @typedef {"present" | "missing" | "unknown"} Presence
 *
 * @typedef {{
 *   name: string;
 *   version: string;
 *   presence: Presence;
 *   detail?: string;
 * }} Result
 */

/**
 * The packages a publish is expected to land: every manifest Lerna-Lite manages
 * that is not `private`. Mirrors lerna's own selection, so the guard can never
 * check a different set than the publish shipped.
 *
 * `private` is read for TRUTHINESS, not for `=== true`, because that is what
 * lerna-lite does (`Package.private` is `Boolean(manifest.private)`) — and the
 * difference is live in this repo: `packages/core` declares the STRING
 * `"private": "true"`. Comparing against the boolean makes the guard demand
 * `@mittwald/flow-core` on npm, where it has never been published.
 *
 * @param {{ path: string; manifest: Manifest }[]} entries
 * @returns {Publishable[]}
 */
export function collectPublishable(entries) {
  /** @type {Publishable[]} */
  const publishable = [];
  for (const { path, manifest } of entries) {
    if (manifest.private) continue;
    if (
      typeof manifest.name !== "string" ||
      typeof manifest.version !== "string"
    )
      continue;
    publishable.push({ path, name: manifest.name, version: manifest.version });
  }
  return publishable;
}

/**
 * Packages whose manifest fell out of lockstep with `lerna.json`. Fixed
 * versioning means they agree; when they do not, `lerna publish from-package`
 * has already shipped what the MANIFEST says, so the release is split across
 * two versions and the registry check below would be aimed at the wrong one.
 *
 * @param {string} lernaVersion
 * @param {Publishable[]} publishable
 * @returns {Publishable[]}
 */
export function collectOutOfLockstep(lernaVersion, publishable) {
  return publishable.filter((pkg) => pkg.version !== lernaVersion);
}

/**
 * What one registry answer says about a version's existence.
 *
 * `unknown` is deliberately NOT "missing": a 5xx, a rate limit or a dropped
 * connection says nothing about the version, and reporting it as a hole would
 * send someone republishing over a release that is already complete.
 *
 * @param {number} status HTTP status, or 0 when the request never completed.
 * @returns {Presence}
 */
export function classifyStatus(status) {
  if (status === 200) return "present";
  if (status === 404) return "missing";
  return "unknown";
}

/**
 * Delays (ms) between re-checks of a package that did not answer `present`.
 *
 * The budget is load-bearing, not politeness. npm's registry is not immediately
 * consistent across its CDN, so the version this very job just published can
 * still 404. Only a package that is still not `present` after the whole
 * schedule counts — a guard that fires false reds after a good publish gets
 * ignored, and an ignored guard is worse than none.
 *
 * Five minutes, because seconds are not enough: on the 1.1.31 backfill (run
 * 34577464400) `flow-remote-elements` and `flow-remote-react-renderer` were
 * readable within seconds of the publish, while `flow-stylesheet` — published
 * in the same command, between the two — kept answering 404 for minutes.
 *
 * Spent only on packages that look missing, so a complete release pays nothing.
 *
 * @returns {number[]} Eight delays, ~305s total.
 */
export function backoffDelays() {
  return [5000, 10_000, 20_000, 30_000, 60_000, 60_000, 60_000, 60_000];
}

/**
 * The run's verdict. `missing` fails it — that is the hole the guard exists
 * for. `unknown` fails it too, but as a distinct outcome: the release may well
 * be complete, and the remedy is to re-run the check, not to republish.
 *
 * @param {Result[]} results
 */
export function verdict(results) {
  const missing = results.filter((r) => r.presence === "missing");
  const unknown = results.filter((r) => r.presence === "unknown");
  return { ok: missing.length === 0 && unknown.length === 0, missing, unknown };
}

/**
 * Markdown table for the job summary — one row per package, so a red run shows
 * WHICH packages are missing without anyone opening the raw log.
 *
 * @param {string} lernaVersion
 * @param {Result[]} results
 * @returns {string}
 */
export function renderReport(lernaVersion, results) {
  const icon = { present: "✅", missing: "❌", unknown: "⚠️" };
  const rows = results.map(
    (r) =>
      `| ${icon[r.presence]} | \`${r.name}\` | ${r.version} | ${r.detail ?? r.presence} |`,
  );
  const { ok, missing, unknown } = verdict(results);
  // The headline claims no version: each row was checked at the MANIFEST's own
  // version, which equals `lernaVersion` only while lockstep holds — and a
  // report that says "all resolve at 1.1.31" over a row reading 1.1.30 is
  // exactly the kind of false assurance this guard exists to remove.
  const headline = ok
    ? `All ${results.length} publishable package(s) resolve on the registry.`
    : `${missing.length} missing, ${unknown.length} unverifiable of ${results.length} publishable package(s).`;

  return [
    `### Publish completeness — ${lernaVersion}`,
    "",
    headline,
    "",
    "|  | Package | Version | Registry |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}
