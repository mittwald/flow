# Version-contract guard — design

- **Date:** 2026-07-29
- **Tracking:** [#2738](https://github.com/mittwald/flow/issues/2738) →
  "Version-contract guard"
- **Contract source:**
  [ADR 0005 — Semver contract at 1.0.0](../../adr/0005-semver-contract.md)
- **Sibling of:** the `routing` job in `.github/workflows/commit-guard.yml` (PR
  #2747)

## Context

At 1.0.0 the `engines.node` floor (ADR 0005 §2) and the `react` /
peer-dependency ranges (§3) become part of the public semver contract: **raising
a Node floor or narrowing a peer range is a breaking change** and must go to the
major line. The existing `routing` job reads only the PR title/body marker — it
cannot tell that a `package.json` change _is_ breaking. Nothing mechanically
stops a PR titled `fix:` from tightening these ranges.

[#2728](https://github.com/mittwald/flow/pull/2728) is the motivating case:
titled `fix:`, it added `engines.node` floors to five packages **and** narrowed
the `react-hook-form` peer from `*` to `^7.65.0` — both breaking under ADR 0005,
shipped unmarked.

This guard detects such changes from the diff and fails the PR unless it carries
a breaking marker.

## Goal / non-goals

**Goal:** on a PR to a standing release line, fail when a publishable package's
`engines.node` floor is raised/added or a peer range is narrowed, unless the PR
is marked breaking.

**Non-goals (v1):**

- No EOL-Node-drop exception (ADR 0005 §2's "dropping an already-EOL version may
  ship in a Minor"). Every Node-floor raise requires a marker. → future
  extension.
- No node-entry-package special-casing (see "Honest simplification" below).
- Newly-**added** peer dependencies are **not** flagged. → future extension.
- Does not police type-level, visual, DOM, CSS, or token surfaces — ADR 0005 §4
  explicitly leaves those unguaranteed.

## Behaviour

### Activation (self-gating, mirrors `routing`)

- Runs only when the PR base is `main` or `next`.
- **Dormant until the `next` branch exists** (`git ls-remote … next`) — pre-cut
  every change legitimately targets `main`, so the guard is off. Activates at
  the 1.0.0 cut.
- **Exempt heads:** `next`, a major line (`N.x` / `N.M` / `next-major`), and
  `sync/*` — the same promotion/forward-merge exemptions as `routing` (ADR 0004
  §8), which are _supposed_ to carry breaking changes.
- A tracked post-cut cleanup item (#2738) removes this dormancy once `next` is
  permanent.

### Escape hatch (marker-only)

A breaking finding is allowed through **only** if the PR is marked breaking,
using the same detection as `routing`:

- title matches `^[a-z]+(\([^)]+\))?!:` (e.g. `feat!:`, `fix(Button)!:`), or
- body has a line matching `^\s*BREAKING(-| )CHANGE:`.

Interaction with `routing`: on `main`/`next` a marked-breaking PR passes this
guard but is then **rejected by `routing`** and pushed to the major line —
exactly ADR 0005. The two jobs are complementary: `routing` enforces _where_ a
marked change lands; this guard detects an _unmarked_ breaking `package.json`
change.

### Scope

Only **non-private** (`private !== true`) `package.json` files — the publishable
packages that form the consumer contract. Private apps/tooling and the workspace
root are skipped.

## Architecture

Three files under `.github/scripts/`, no runtime dependencies:

| File                            | Responsibility                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `version-contract-lib.mjs`      | **Pure** classification logic. No git, no IO. Exported functions below. Unit-tested.                            |
| `version-contract-guard.mjs`    | Git IO shell: enumerate HEAD package.json, load each base version, call the lib, print findings, set exit code. |
| `version-contract-lib.test.mjs` | `node --test` suite over the pure lib.                                                                          |

### Pure lib API (`version-contract-lib.mjs`)

```
parseRange(range) -> IntervalSet | null      // null = unparseable
classifyRangeChange(oldRange, newRange) -> "ok" | "narrowed" | "unparseable"
classifyEngineChange(oldNode, newNode) -> "ok" | "raised" | "unparseable"
isBreakingMarker(title, body) -> boolean
collectFindings(packages) -> Finding[]        // packages: {name, base, head}
```

- `Finding = { package, surface, kind, detail }` where `surface` is
  `"engines.node"` or `"peer:<name>"`.
- `collectFindings` receives already-loaded base/head `package.json` objects (or
  `null` when the file is absent on a side), so it is pure and fully testable
  without git.

### Range model (deterministic, hermetic)

Each range is normalised to a **union of half-open version intervals**
`[min, maxExcl)` over `major.minor.patch` (prerelease/build ignored; a
comparator carrying a prerelease tag → the whole range is `unparseable`).
Supported grammar:

| Input           | Interval                           |
| --------------- | ---------------------------------- |
| `*`, empty      | `[0.0.0, ∞)`                       |
| `>=X.Y.Z`       | `[X.Y.Z, ∞)`                       |
| exact `X.Y.Z`   | `[X.Y.Z, X.Y.Z]` (inclusive point) |
| `^X.Y.Z`, `X>0` | `[X.Y.Z, (X+1).0.0)`               |
| `^0.Y.Z`, `Y>0` | `[0.Y.Z, 0.(Y+1).0)`               |
| `^0.0.Z`        | `[0.0.Z, 0.0.(Z+1))`               |
| `~X.Y.Z`        | `[X.Y.Z, X.(Y+1).0)`               |
| `A \|\| B`      | union of the parts                 |

Anything outside this grammar → `parseRange` returns `null`.

**Classification** of `old → new` (after normalising both to interval sets):

- `new ⊇ old` and `new ≠ old` → **widened** → `ok`
- `new ⊆ old` and `new ≠ old` → **narrowed** → breaking
- `new = old` → no change → `ok`
- neither is a superset (a shift, e.g. `^18` → `^19`) → treated as **narrowed**
  (minimum raised / major dropped) → breaking
- either side `null` → **`unparseable`** → **fail-closed** (treated as a
  breaking finding so the guard is never silently permissive)

Subset test: `A ⊆ B` iff every interval of `A` is fully covered by `B`'s
intervals.

**Per-surface rules:**

- `engines.node`: base absent ⇒ treat as `*` (any). Head absent (floor removed)
  ⇒ widened ⇒ `ok`. Otherwise apply the range classification; `narrowed` ⇒
  `raised` (breaking).
- Each peer key present in **base**: apply range classification; `narrowed` ⇒
  breaking. Peer **removed** (absent in head) ⇒ `ok`. Peer **added** (absent in
  base) ⇒ `ok` in v1 (unflagged).

### Guard shell (`version-contract-guard.mjs`)

Runs inside the checked-out repo:

1. `git ls-files '**/package.json' 'package.json'` → candidate files present in
   HEAD.
2. For each: read HEAD JSON (working tree); read base JSON via
   `git show origin/$BASE_REF:<path>` (absent ⇒ `null`). Skip if HEAD
   `private === true`.
3. Build `{name, base, head}` list → `collectFindings`.
4. Compute `isBreakingMarker(PR_TITLE, PR_BODY)`.
5. If findings exist **and** no marker → print each finding as a GitHub
   `::error::` annotation naming package + surface + old→new, then `exit 1`.
   Else print an OK/notice and `exit 0`.

Env in: `BASE_REF`, `PR_TITLE`, `PR_BODY`.

### Workflow job (`version-contract` in `commit-guard.yml`)

```
version-contract:
  name: Version contract (engines.node + peer ranges)
  if: base == 'main' || base == 'next'
  steps:
    - id: gate           # self-gating + exemptions -> outputs.active
    - if active: actions/checkout (fetch base ref for `git show origin/$BASE`)
    - if active: node --test .github/scripts/version-contract-lib.test.mjs
    - if active: node .github/scripts/version-contract-guard.mjs   # env: BASE_REF/PR_TITLE/PR_BODY
```

- The `gate` step reproduces `routing`'s self-gating + exemption bash and writes
  a single `active` output; all heavy steps are
  `if: steps.gate.outputs.active == 'true'`.
- Checkout fetches the base ref so `git show origin/$BASE_REF:<path>` resolves.
- The `node --test` step runs the lib suite on every invocation, so a broken
  classifier fails the job rather than mis-passing a PR.

## Honest simplification: node-entry packages

ADR 0005 §2 makes `@mittwald/ext-bridge` and `@mittwald/flow-remote-core` (the
packages with a `node` export condition) _stricter_: any Node-floor raise is
breaking regardless of EOL. In v1 we implement **no EOL exception**, so _every_
Node-floor raise is already breaking for _every_ package — the strict/normal
distinction is a **no-op**. We therefore do **not** write node-entry detection
now (it would be dead code); it becomes relevant only alongside the future
EOL-drop override, documented as the extension point.

## Testing

`version-contract-lib.test.mjs` (`node --test`) covers the pure lib:

- `classifyRangeChange`: widen (`^19.2.0` → `^19.0.0 || ^20.0.0` = ok), narrow
  (`*` → `^7.65.0` = breaking — the #2728 case), shift (`^18` → `^19` =
  breaking), equal (ok), unparseable (fail-closed), caret 0.x semantics, `~`,
  exact, unions.
- `classifyEngineChange`: add floor (`absent` → `>=24` = raised), raise (`>=20`
  → `>=24` = raised), lower (`>=24` → `>=20` = ok), remove (ok), equal (ok).
- `isBreakingMarker`: `feat!:`, `fix(x)!:`, `BREAKING CHANGE:` /
  `BREAKING-CHANGE:` body, plain `fix:` (false).
- `collectFindings`: end-to-end on a reconstructed #2728-shaped input (the five
  added floors + the react-hook-form narrowing) → expected findings; a benign
  widen-only diff → no findings; added-peer → no finding (v1); private package
  ignored.

## Rollout

- New files: the three `.github/scripts/version-contract-*.mjs` + the
  `version-contract` job in `commit-guard.yml`. No changes to existing jobs.
- PR title: `ci:` (a CI-only change; not `feat`, so it lands on `main` fine
  pre-cut).
- Manual verification before merge: run the guard locally against a synthetic
  #2728-shaped diff and against a benign diff; confirm exit codes.

## Future extensions (out of scope for v1)

1. **EOL-Node-drop exception** (ADR 0005 §2) + the node-entry strict carve-out —
   needs an override channel (e.g. a `Contract-Change:` body trailer) and an EOL
   data source.
2. **Flag newly-added required peers** as breaking (new consumer obligation).
3. Remove the self-gating dormancy post-cut (tracked in #2738).
