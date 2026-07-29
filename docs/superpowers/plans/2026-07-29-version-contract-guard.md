# Version-contract guard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CI guard that fails a PR which raises `engines.node` or narrows
a peer-dependency range on a publishable Flow package without a breaking marker,
per ADR 0005.

**Architecture:** A third job, `version-contract`, in
`.github/workflows/commit-guard.yml`, gated exactly like the existing `routing`
job (dormant until the `next` branch exists). It runs two checked-in ES-module
scripts: a **pure** classifier (`version-contract-lib.mjs`, unit-tested with
`node --test`) and a thin git-IO shell (`version-contract-guard.mjs`) that diffs
every `package.json` between the PR base and head and calls the classifier.

**Tech Stack:** GitHub Actions, plain Node.js ES modules (no third-party
dependencies), `node:test` built-in test runner.

**Spec:**
[docs/superpowers/specs/2026-07-29-version-contract-guard-design.md](../specs/2026-07-29-version-contract-guard-design.md)

## Global Constraints

- **No third-party dependencies in the scripts.** Hermetic; only Node built-ins
  (`node:test`, `node:assert`, `node:child_process`, `node:fs`). `semver` is
  deliberately not used (not hoisted, undeclared).
- **Node floor `>=24`.** Scripts use only stable Node APIs available on the
  runner.
- **Fail-closed.** Any range the classifier cannot parse is treated as a
  breaking finding — never silently permissive.
- **Prettier gate.** The pre-commit hook runs `pnpm lint` (includes
  `format:check`). Run `corepack pnpm exec prettier --write <files>` before
  every commit or the commit is blocked.
- **This change ships as `ci:`** (not a `feat`), so it lands on `main` pre-cut
  without tripping routing.
- **No nx wiring needed.** These scripts run only inside the GitHub Actions job,
  not as an nx target, so no `project.json`/`nx.json` changes.
- **Breaking-marker detection must match the `routing` job exactly:** title
  `^[a-z]+(\([^)]+\))?!:` or a body line `^[ \t]*BREAKING(-| )CHANGE:`.
- **Scope = publishable Flow packages only:** `name` starts with `@mittwald/`
  **and** not private. `private` may be the boolean `true` **or** the string
  `"true"` — treat both as private.

---

### Task 1: Range model + `parseRange`

**Files:**

- Create: `.github/scripts/version-contract-lib.mjs`
- Test: `.github/scripts/version-contract-lib.test.mjs`

**Interfaces:**

- Consumes: nothing.
- Produces: `parseRange(range: string|null|undefined) -> IntervalSet | null`,
  where `IntervalSet` is a normalised array of half-open intervals
  `[[major,minor,patch], [major,minor,patch] | null]` (`null` upper bound = +∞).
  Returns `null` for any range outside the supported grammar. Internal
  (non-exported) helpers `cmp`, `cmpHi`, `parseVersion`, `parseComparator`,
  `normalise` also live in this file and are relied on by Task 2.

- [ ] **Step 1: Write the failing test**

Create `.github/scripts/version-contract-lib.test.mjs`:

```js
// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRange } from "./version-contract-lib.mjs";

test("parseRange: supported shapes parse to a non-null IntervalSet", () => {
  assert.ok(parseRange("*"));
  assert.ok(parseRange(""));
  assert.ok(parseRange(">=24.0.0"));
  assert.ok(parseRange("^19.2.0"));
  assert.ok(parseRange("~1.2.3"));
  assert.ok(parseRange("1.2.3"));
  assert.ok(parseRange("^19.0.0 || ^20.0.0"));
});

test("parseRange: unsupported shapes → null (fail-closed upstream)", () => {
  assert.equal(parseRange(">1.0.0"), null); // strict-greater unsupported
  assert.equal(parseRange("1.2.3-beta"), null); // prerelease tag unsupported
  assert.equal(parseRange(">=1 <2"), null); // space-joined range unsupported
  assert.equal(parseRange("latest"), null); // dist-tag
  assert.equal(parseRange(null), null);
  assert.equal(parseRange(undefined), null);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: FAIL
— cannot import `parseRange` (module not found /
`parseRange is not a function`).

- [ ] **Step 3: Write the minimal implementation**

Create `.github/scripts/version-contract-lib.mjs`:

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: PASS
— `# pass 2`, `# fail 0`.

- [ ] **Step 5: Format and commit**

```bash
corepack pnpm exec prettier --write .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git add .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git commit -m "ci: add version-contract range parser (parseRange)"
```

---

### Task 2: Classification (`classifyRangeChange`, `classifyEngineChange`)

**Files:**

- Modify: `.github/scripts/version-contract-lib.mjs`
- Test: `.github/scripts/version-contract-lib.test.mjs`

**Interfaces:**

- Consumes: `parseRange` and the internal helpers `cmp`, `cmpHi` from Task 1.
- Produces:
  - `classifyRangeChange(oldRange, newRange) -> "ok" | "narrowed" | "unparseable"`
    — `"ok"` when the new range is a superset of the old (widened or equal);
    `"narrowed"` when it drops any previously-accepted version (narrow, shift,
    or raised minimum); `"unparseable"` when either side is outside the grammar.
  - `classifyEngineChange(oldNode, newNode) -> "ok" | "raised" | "unparseable"`
    — an absent floor (`null`/`undefined`) on either side is treated as `"*"`
    (any); a narrowing is reported as `"raised"`.

- [ ] **Step 1: Write the failing test**

Append to `.github/scripts/version-contract-lib.test.mjs` (add the two names to
the existing import):

```js
import {
  parseRange,
  classifyRangeChange,
  classifyEngineChange,
} from "./version-contract-lib.mjs";

test("classifyRangeChange: widen / equal → ok", () => {
  assert.equal(classifyRangeChange("^19.2.0", "^19.0.0 || ^20.0.0"), "ok"); // widen
  assert.equal(classifyRangeChange("^19.2.0", "^19.2.0"), "ok"); // equal
  assert.equal(classifyRangeChange("^19.2.0", ">=19.2.0"), "ok"); // widen to open
  assert.equal(classifyRangeChange("1.2.3", "^1.0.0"), "ok"); // point → wider caret
});

test("classifyRangeChange: narrow / shift / raised-min → narrowed", () => {
  assert.equal(classifyRangeChange("*", "^7.65.0"), "narrowed"); // #2728 react-hook-form
  assert.equal(
    classifyRangeChange("^18.0.0 || ^19.0.0", "^19.0.0"),
    "narrowed",
  ); // drop a major
  assert.equal(classifyRangeChange("^18.0.0", "^19.0.0"), "narrowed"); // shift up
  assert.equal(classifyRangeChange(">=18.0.0", ">=20.0.0"), "narrowed"); // raise min
});

test("classifyRangeChange: unparseable either side → unparseable", () => {
  assert.equal(classifyRangeChange(">1", "^2.0.0"), "unparseable");
  assert.equal(classifyRangeChange("^1.0.0", "latest"), "unparseable");
});

test("classifyEngineChange: raises vs relaxations", () => {
  assert.equal(classifyEngineChange(null, ">=24.0.0"), "raised"); // add a floor
  assert.equal(classifyEngineChange(">=20.0.0", ">=24.0.0"), "raised"); // raise
  assert.equal(classifyEngineChange(">=24.0.0", ">=20.0.0"), "ok"); // lower
  assert.equal(classifyEngineChange(">=24.0.0", null), "ok"); // remove floor
  assert.equal(classifyEngineChange(">=24.0.0", ">=24.0.0"), "ok"); // unchanged
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: FAIL
— `classifyRangeChange is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Append to `.github/scripts/version-contract-lib.mjs`:

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: PASS
— `# pass 6`, `# fail 0`.

- [ ] **Step 5: Format and commit**

```bash
corepack pnpm exec prettier --write .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git add .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git commit -m "ci: add version-contract range/engine classifiers"
```

---

### Task 3: Marker detection + `collectFindings`

**Files:**

- Modify: `.github/scripts/version-contract-lib.mjs`
- Test: `.github/scripts/version-contract-lib.test.mjs`

**Interfaces:**

- Consumes: `classifyRangeChange`, `classifyEngineChange` from Task 2.
- Produces:
  - `isBreakingMarker(title, body) -> boolean`.
  - `collectFindings(packages) -> Finding[]` where `packages` is
    `{ name: string, base: object|null, head: object|null }[]` and `Finding` is
    `{ package: string, surface: string, kind: string, detail: string }`.
    `surface` is `"engines.node"` or `"peer:<name>"`; `kind` is `"raised"`,
    `"narrowed"`, or `"unparseable"`. It skips non-publishable packages (an
    internal `isPublishable` helper) and packages new in this PR
    (`base === null`), and does **not** flag newly-added peers.

- [ ] **Step 1: Write the failing test**

Append to `.github/scripts/version-contract-lib.test.mjs` (add the two names to
the import):

```js
import {
  parseRange,
  classifyRangeChange,
  classifyEngineChange,
  isBreakingMarker,
  collectFindings,
} from "./version-contract-lib.mjs";

test("isBreakingMarker: title bang and body trailer", () => {
  assert.equal(isBreakingMarker("feat!: x", ""), true);
  assert.equal(isBreakingMarker("fix(Button)!: x", ""), true);
  assert.equal(isBreakingMarker("fix: x", "line\nBREAKING CHANGE: y"), true);
  assert.equal(isBreakingMarker("fix: x", "BREAKING-CHANGE: y"), true);
  assert.equal(isBreakingMarker("fix: x", "just a normal body"), false);
  assert.equal(isBreakingMarker("feat: x", ""), false); // feat without ! is not breaking
});

test("collectFindings: #2728-shaped diff → engine + peer findings", () => {
  const packages = [
    {
      name: "@mittwald/flow-icons",
      base: { name: "@mittwald/flow-icons" }, // existed, no engines
      head: { name: "@mittwald/flow-icons", engines: { node: ">=24.0.0" } },
    },
    {
      name: "@mittwald/flow-remote-react-components",
      base: {
        name: "@mittwald/flow-remote-react-components",
        peerDependencies: { "react-hook-form": "*" },
      },
      head: {
        name: "@mittwald/flow-remote-react-components",
        peerDependencies: { "react-hook-form": "^7.65.0" },
      },
    },
  ];
  const got = collectFindings(packages)
    .map((f) => `${f.package}:${f.surface}:${f.kind}`)
    .sort();
  assert.deepEqual(got, [
    "@mittwald/flow-icons:engines.node:raised",
    "@mittwald/flow-remote-react-components:peer:react-hook-form:narrowed",
  ]);
});

test("collectFindings: benign changes → no findings", () => {
  const packages = [
    {
      name: "@mittwald/flow-react-components",
      base: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.2.0" },
      },
      head: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.0.0 || ^20.0.0" }, // widened
      },
    },
    {
      name: "@mittwald/react-tunnel",
      base: { name: "@mittwald/react-tunnel" },
      head: {
        name: "@mittwald/react-tunnel",
        peerDependencies: { mobx: "^6.0.0" }, // newly-added peer, unflagged in v1
      },
    },
    {
      name: "@mittwald/flow-stylesheet",
      base: {
        name: "@mittwald/flow-stylesheet",
        engines: { node: ">=24.0.0" },
      },
      head: {
        name: "@mittwald/flow-stylesheet",
        engines: { node: ">=22.0.0" }, // lowered floor
      },
    },
  ];
  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: non-publishable and new packages are skipped", () => {
  const packages = [
    {
      name: "@mittwald/flow-core",
      base: {
        name: "@mittwald/flow-core",
        private: "true", // string form
        peerDependencies: { react: "*" },
      },
      head: {
        name: "@mittwald/flow-core",
        private: "true",
        peerDependencies: { react: "^19.0.0" }, // would narrow, but skipped
      },
    },
    {
      name: "acorn",
      base: { name: "acorn", engines: { node: ">=0.4.0" } },
      head: { name: "acorn", engines: { node: ">=24.0.0" } }, // not @mittwald → skipped
    },
    {
      name: "@mittwald/flow-new",
      base: null, // brand-new package → skipped
      head: {
        name: "@mittwald/flow-new",
        engines: { node: ">=24.0.0" },
        peerDependencies: { react: "^19.0.0" },
      },
    },
  ];
  assert.deepEqual(collectFindings(packages), []);
});

test("collectFindings: unparseable peer change → fail-closed finding", () => {
  const packages = [
    {
      name: "@mittwald/flow-react-components",
      base: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "^19.0.0" },
      },
      head: {
        name: "@mittwald/flow-react-components",
        peerDependencies: { react: "latest" },
      },
    },
  ];
  const findings = collectFindings(packages);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "unparseable");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: FAIL
— `isBreakingMarker is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Append to `.github/scripts/version-contract-lib.mjs`:

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test .github/scripts/version-contract-lib.test.mjs` Expected: PASS
— `# pass 11`, `# fail 0`.

- [ ] **Step 5: Format and commit**

```bash
corepack pnpm exec prettier --write .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git add .github/scripts/version-contract-lib.mjs .github/scripts/version-contract-lib.test.mjs
git commit -m "ci: add version-contract findings collector + marker detection"
```

---

### Task 4: Guard shell (`version-contract-guard.mjs`) + local verification

**Files:**

- Create: `.github/scripts/version-contract-guard.mjs`

**Interfaces:**

- Consumes: `collectFindings`, `isBreakingMarker` from the lib (Tasks 2–3).
- Produces: an executable script. Env in: `BASE_SHA` (required), `PR_TITLE`,
  `PR_BODY`. Exit `0` on OK or marked-breaking, `1` on unmarked breaking
  finding, `2` on misconfiguration (missing `BASE_SHA`). Reads HEAD manifests
  from the working tree and base manifests via `git show <BASE_SHA>:<path>`.

- [ ] **Step 1: Write the implementation**

Create `.github/scripts/version-contract-guard.mjs`:

```js
#!/usr/bin/env node
// @ts-check
/**
 * Version-contract guard — git-IO shell around version-contract-lib.mjs.
 *
 * Fails (exit 1) when a publishable package raises engines.node or narrows a
 * peer range without a breaking marker on the PR. See the design spec:
 * docs/superpowers/specs/2026-07-29-version-contract-guard-design.md
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { collectFindings, isBreakingMarker } from "./version-contract-lib.mjs";

const BASE_SHA = process.env.BASE_SHA;
const PR_TITLE = process.env.PR_TITLE ?? "";
const PR_BODY = process.env.PR_BODY ?? "";

if (!BASE_SHA) {
  console.error("BASE_SHA is required");
  process.exit(2);
}

/** @param {string[]} args */
function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function listManifests() {
  return git(["ls-files"])
    .split("\n")
    .map((s) => s.trim())
    .filter((p) => p === "package.json" || p.endsWith("/package.json"));
}

/** @returns {object | null} */
function readHead(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** @returns {object | null} */
function readBase(path) {
  try {
    return JSON.parse(git(["show", `${BASE_SHA}:${path}`]));
  } catch {
    return null; // absent on base (new file) or unreadable
  }
}

const packages = listManifests().map((path) => {
  const head = readHead(path);
  const base = readBase(path);
  return { name: head?.name ?? path, base, head };
});

const findings = collectFindings(packages);

if (findings.length === 0) {
  console.log(
    "Version contract OK — no engines.node raise or peer narrowing detected.",
  );
  process.exit(0);
}

const marked = isBreakingMarker(PR_TITLE, PR_BODY);
for (const f of findings) {
  const line = `${f.package}: ${f.surface} ${f.kind} (${f.detail})`;
  console.log(`::${marked ? "notice" : "error"}::${line}`);
}

if (marked) {
  console.log(
    "Breaking marker present — contract change acknowledged. The routing guard sends it to the major line.",
  );
  process.exit(0);
}

console.error(
  "::error::Version contract: a breaking engines.node/peer change is not marked breaking. " +
    "Add a breaking marker (`type!:` or a `BREAKING CHANGE:` body) so it routes to the major line, or revert the tightening.",
);
process.exit(1);
```

- [ ] **Step 2: Verify the clean case passes (no diff vs HEAD → exit 0)**

Run:

```bash
BASE_SHA=$(git rev-parse HEAD) node .github/scripts/version-contract-guard.mjs; echo "exit=$?"
```

Expected: `Version contract OK …` and `exit=0` (base == head, so no changes).

- [ ] **Step 3: Verify an unmarked narrowing fails (exit 1)**

Edit `packages/components/package.json` — change the React peer
`"react": "^19.2.0"` to `"react": "^20.0.0"` (a shift up = narrowing), then:

```bash
BASE_SHA=$(git rev-parse HEAD) PR_TITLE="fix: tweak peer" PR_BODY="" node .github/scripts/version-contract-guard.mjs; echo "exit=$?"
```

Expected: a line
`::error::@mittwald/flow-react-components: peer:react narrowed (^19.2.0 -> ^20.0.0)`,
the summary error, and `exit=1`.

- [ ] **Step 4: Verify a marked narrowing passes (exit 0)**

With the same edit still in place:

```bash
BASE_SHA=$(git rev-parse HEAD) PR_TITLE="fix!: tweak peer" PR_BODY="" node .github/scripts/version-contract-guard.mjs; echo "exit=$?"
```

Expected: a `::notice::` line for the same finding, the "Breaking marker
present" message, and `exit=0`.

- [ ] **Step 5: Revert the scratch edit**

```bash
git checkout -- packages/components/package.json
git status --short   # expect: only the new guard script untracked/staged, no package.json change
```

- [ ] **Step 6: Format and commit**

```bash
corepack pnpm exec prettier --write .github/scripts/version-contract-guard.mjs
git add .github/scripts/version-contract-guard.mjs
git commit -m "ci: add version-contract guard shell (git diff + exit code)"
```

---

### Task 5: Wire the `version-contract` job into `commit-guard.yml`

**Files:**

- Modify: `.github/workflows/commit-guard.yml` (append a third job after
  `routing`)

**Interfaces:**

- Consumes: `.github/scripts/version-contract-lib.test.mjs` and
  `.github/scripts/version-contract-guard.mjs` (Tasks 1–4).
- Produces: the `version-contract` CI job. No other job changes.

- [ ] **Step 1: Append the job**

Add this job at the end of `.github/workflows/commit-guard.yml`, at the same
indentation as the existing `conventional-title` and `routing` jobs (two
spaces):

```yaml
version-contract:
  name: Version contract (engines.node + peer ranges)
  # Same standing-line scope as routing: only PRs targeting a release line.
  if: >-
    github.event.pull_request.base.ref == 'main' ||
    github.event.pull_request.base.ref == 'next'
  runs-on: ubuntu-latest
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
    PR_BODY: ${{ github.event.pull_request.body }}
    HEAD_REF: ${{ github.event.pull_request.head.ref }}
    BASE_SHA: ${{ github.event.pull_request.base.sha }}
    REPO: ${{ github.repository }}
  steps:
    - name: Gate (self-gating + promotion/sync exemptions)
      id: gate
      run: |
        set -euo pipefail

        # Dormant until `next` exists (pre-1.0.0-cut) — mirrors the routing job.
        if ! git ls-remote --exit-code --heads "https://github.com/${REPO}.git" next >/dev/null 2>&1; then
          echo "::notice::'next' branch does not exist yet — version-contract guard dormant (pre-1.0.0-cut). Skipping."
          echo "active=false" >> "$GITHUB_OUTPUT"
          exit 0
        fi

        # Promotion / forward-merge / sync sources legitimately carry breaking
        # changes (ADR 0004 §8) — exempt, same as routing.
        if [ "$HEAD_REF" = "next" ] \
           || printf '%s' "$HEAD_REF" | grep -qE '^([0-9]+\.(x|[0-9]+)|next-major)$' \
           || printf '%s' "$HEAD_REF" | grep -qE '^sync/'; then
          echo "::notice::head='${HEAD_REF}' is a promotion/sync source — version-contract guard exempt."
          echo "active=false" >> "$GITHUB_OUTPUT"
          exit 0
        fi

        echo "active=true" >> "$GITHUB_OUTPUT"

    - name: Checkout (full history so the base commit is reachable)
      if: steps.gate.outputs.active == 'true'
      uses: actions/checkout@93cb6efe18208431cddfb8368fd83d5badbf9bfd # v5
      with:
        fetch-depth: 0

    - name: Self-test the classifier
      if: steps.gate.outputs.active == 'true'
      run: node --test .github/scripts/version-contract-lib.test.mjs

    - name: Enforce the version contract
      if: steps.gate.outputs.active == 'true'
      run: node .github/scripts/version-contract-guard.mjs
```

- [ ] **Step 2: Validate the workflow YAML parses**

Run:

```bash
node -e "const fs=require('fs');const s=fs.readFileSync('.github/workflows/commit-guard.yml','utf8');if(!/version-contract:/.test(s))throw new Error('job missing');console.log('job present; bytes='+s.length)"
```

Expected: `job present; bytes=…` (no throw). If `actionlint` is installed
(`command -v actionlint`), also run
`actionlint .github/workflows/commit-guard.yml` and expect no errors.

- [ ] **Step 3: Confirm the guard is currently dormant (no `next` branch)**

Run:

```bash
git ls-remote --exit-code --heads https://github.com/mittwald/flow.git next >/dev/null 2>&1 && echo "next EXISTS (guard active)" || echo "next ABSENT (guard dormant — expected pre-cut)"
```

Expected: `next ABSENT (guard dormant — expected pre-cut)` — confirming the job
will be a no-op on real PRs until the 1.0.0 cut, exactly like `routing`.

- [ ] **Step 4: Format and commit**

```bash
corepack pnpm exec prettier --write .github/workflows/commit-guard.yml
git add .github/workflows/commit-guard.yml
git commit -m "ci: add version-contract guard job to commit-guard workflow"
```

- [ ] **Step 5: Final lint sweep**

Run:

```bash
corepack pnpm lint
```

Expected: passes. If eslint flags the new `.mjs` files (e.g. an env/globals
rule), fix minimally in-file rather than disabling the rule wholesale; re-run
until clean.

---

## Notes for the PR

- **PR title:** `ci: add version-contract guard (engines.node + peer ranges)` —
  a `ci:` change, so it lands on `main` fine pre-cut.
- **PR body:** link the tracking issue (#2738) and the spec; note the guard is
  dormant until the `next` branch exists, so CI shows it passing as a no-op on
  this PR.
- After merge, tick the "Version-contract guard" checkbox in
  [#2738](https://github.com/mittwald/flow/issues/2738).

## Self-review (performed against the spec)

- **Spec coverage:** activation/self-gating → Task 5 gate step; marker-only
  escape → `isBreakingMarker` (Task 3) + guard logic (Task 4); all-peers scope →
  `collectFindings` peer loop (Task 3); new-peers-unflagged → Task 3 (loops base
  peers only) + benign test; scope `@mittwald/`+private gotcha → `isPublishable`
  (Task 3) + skip test; range model + fail-closed → Tasks 1–2 + unparseable
  tests; node-entry no-op → not implemented by design (documented in spec);
  three-file layout + self-test step → Tasks 1–5. All covered.
- **Placeholder scan:** none — every step has concrete code/commands and
  expected output.
- **Type consistency:** `parseRange`→`IntervalSet|null`,
  `classifyRangeChange`/`classifyEngineChange` verdict strings,
  `collectFindings`→`Finding[]`, and the guard's env
  (`BASE_SHA`/`PR_TITLE`/`PR_BODY`) are used identically across tasks and match
  the workflow job.
