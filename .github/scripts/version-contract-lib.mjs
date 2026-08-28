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

/** Parse "X.Y.Z" into a Version, or null if not a full numeric triple. */
function parseVersion(str) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(str.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
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

/** True iff every interval of A is covered by a single interval of B. */
function isSubset(A, B) {
  return A.every(([lo, hi]) =>
    B.some(([blo, bhi]) => cmp(blo, lo) <= 0 && cmpHi(bhi, hi) >= 0),
  );
}

/**
 * Classify a range change old→new.
 *
 * @returns {"ok" | "narrowed" | "unparseable"}
 */
export function classifyRangeChange(oldRange, newRange) {
  const A = parseRange(oldRange);
  const B = parseRange(newRange);
  if (A === null || B === null) return "unparseable";
  // old ⊆ new  ⇒  new is a superset (widened or equal)  ⇒  ok.
  return isSubset(A, B) ? "ok" : "narrowed";
}

/**
 * Classify an engines.node change. An absent floor (either side) means "*".
 *
 * @returns {"ok" | "raised" | "unparseable"}
 */
export function classifyEngineChange(oldNode, newNode) {
  const verdict = classifyRangeChange(oldNode ?? "*", newNode ?? "*");
  return verdict === "narrowed" ? "raised" : verdict;
}

/**
 * Breaking-marker detection — identical to the routing job's classification.
 *
 * @returns {boolean}
 */
export function isBreakingMarker(title, body) {
  const t = String(title ?? "");
  const b = String(body ?? "");
  if (/^[a-z]+(\([^)]+\))?!:/.test(t)) return true;
  if (/^[ \t]*BREAKING(-| )CHANGE:/m.test(b)) return true;
  return false;
}

/**
 * A publishable Flow package: @mittwald/-scoped and not private (string OR
 * boolean).
 */
function isPublishable(pkg) {
  if (!pkg || typeof pkg.name !== "string") return false;
  if (!pkg.name.startsWith("@mittwald/")) return false;
  if (pkg.private === true || pkg.private === "true") return false;
  return true;
}

/**
 * @typedef {{
 *   package: string;
 *   surface: string;
 *   kind: string;
 *   detail: string;
 * }} Finding
 * @param {{ name: string; base: object | null; head: object | null }[]} packages
 * @returns {Finding[]}
 */
export function collectFindings(packages) {
  /** @type {Finding[]} */
  const findings = [];
  for (const { name, base, head } of packages) {
    if (!isPublishable(head)) continue; // not a consumer-facing Flow package
    if (!base) continue; // new package: no prior contract to break
    // Private at the base means it has never been published, so there is no
    // consumer and no prior contract either. Its first publish *establishes*
    // the floor and the peer ranges; it cannot tighten them. Without this,
    // going `private: true` -> public reads as `(none) -> >=24.0.0` and the
    // guard demands a breaking marker for a package nobody could install.
    if (!isPublishable(base)) continue;

    const oldNode = base.engines?.node ?? null;
    const newNode = head.engines?.node ?? null;
    if (oldNode !== newNode) {
      const v = classifyEngineChange(oldNode, newNode);
      if (v === "raised" || v === "unparseable") {
        findings.push({
          package: name,
          surface: "engines.node",
          kind: v,
          detail: `${oldNode ?? "(none)"} -> ${newNode ?? "(none)"}`,
        });
      }
    }

    const basePeers = base.peerDependencies ?? {};
    const headPeers = head.peerDependencies ?? {};
    for (const key of Object.keys(basePeers)) {
      if (!(key in headPeers)) continue; // removed peer = fewer constraints = ok
      const oldR = basePeers[key];
      const newR = headPeers[key];
      // A peer whose range never parses (e.g. `workspace:*`) only yields a
      // finding when its string actually changes; an unchanged value is
      // skipped here, so static workspace peers never trip the guard.
      if (oldR === newR) continue;
      const v = classifyRangeChange(oldR, newR);
      if (v === "narrowed" || v === "unparseable") {
        findings.push({
          package: name,
          surface: `peer:${key}`,
          kind: v,
          detail: `${oldR} -> ${newR}`,
        });
      }
    }
    // Peers present in head but not base (added) are unflagged in v1.
  }
  return findings;
}
