// @ts-check
/**
 * Version-contract classification — pure functions, no git / no IO.
 *
 * Implements the engines.node + peer-range half of the 1.0.0 semver contract
 * (ADR 0005 §2/§3). See
 * docs/superpowers/specs/2026-07-29-version-contract-guard-design.md
 *
 * @typedef {[number, number, number]} Version Major.minor.patch
 *
 * @typedef {[Version, Version | null]} Interval Half-open [lo, hi); hi=null is
 *   +∞
 *
 * @typedef {Interval[]} IntervalSet Normalised: sorted, merged
 */

/** Compare two Versions. @returns {-1 | 0 | 1} */
function cmp(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

/** Compare interval upper bounds where `null` means +∞. @returns {-1 | 0 | 1} */
function cmpHi(a, b) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return cmp(a, b);
}

/** Parse "X", "X.Y" or "X.Y.Z" into a Version, or null if not plain numeric. */
function parseVersion(str) {
  const m = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(str.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

/** Parse a single comparator into an Interval, or null if unsupported. */
function parseComparator(part) {
  const p = part.trim();
  if (p === "" || p === "*" || p === "x" || p === "X") return [[0, 0, 0], null];

  if (p.startsWith(">=")) {
    const v = parseVersion(p.slice(2));
    return v ? [v, null] : null;
  }
  if (p.startsWith("^")) {
    const v = parseVersion(p.slice(1));
    if (!v) return null;
    const [a, b, c] = v;
    if (a > 0) return [v, [a + 1, 0, 0]];
    if (b > 0) return [v, [0, b + 1, 0]];
    return [v, [0, 0, c + 1]];
  }
  if (p.startsWith("~")) {
    const v = parseVersion(p.slice(1));
    if (!v) return null;
    const [a, b] = v;
    return [v, [a, b + 1, 0]];
  }
  const v = parseVersion(p); // exact version
  if (v) return [v, [v[0], v[1], v[2] + 1]];
  return null; // >, <, <=, hyphen ranges, prerelease tags, dist-tags, etc.
}

/** Merge/sort intervals into a normalised IntervalSet. */
function normalise(intervals) {
  const sorted = [...intervals].sort(
    (a, b) => cmp(a[0], b[0]) || cmpHi(a[1], b[1]),
  );
  /** @type {Interval[]} */
  const out = [];
  for (const [lo, hi] of sorted) {
    const last = out[out.length - 1];
    if (!last) {
      out.push([lo, hi]);
      continue;
    }
    if (last[1] === null) continue; // last runs to +∞, swallows the rest
    if (cmp(lo, last[1]) <= 0) {
      if (cmpHi(hi, last[1]) > 0) last[1] = hi; // extend
    } else {
      out.push([lo, hi]);
    }
  }
  return out;
}

/**
 * Parse a semver range into a normalised IntervalSet, or null if any part is
 * outside the supported grammar.
 *
 * @param {string | null | undefined} range
 * @returns {IntervalSet | null}
 */
export function parseRange(range) {
  if (range == null) return null;
  const parts = String(range).split("||");
  /** @type {Interval[]} */
  const intervals = [];
  for (const part of parts) {
    const iv = parseComparator(part);
    if (!iv) return null;
    intervals.push(iv);
  }
  return normalise(intervals);
}
