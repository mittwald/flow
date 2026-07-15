# Cross-version remote smoke tests — Design

**Issue:** [#2600 — Visual regression tests for different remote versions](https://github.com/mittwald/flow/issues/2600)
**Date:** 2026-07-15
**Status:** Design approved (pending spec review)

## Problem

Flow's remote-DOM layer is a **versioned, backwards-compatible protocol**: mStudio
extensions built against an *old* published remote version keep rendering through
the *current* host in production. Today nothing tests that. The existing visual
suite in `packages/remote-react-components` only proves that the **current**
remote (`Remote` environment) renders identically to the **current** local
components (`Local` environment) — both sourced from the working tree, one
version. There is no mechanism to render a **previously published** remote bundle
through the **current** host and confirm it still looks right.

This is the gap #2600 targets: catch host changes that silently break how older
extensions render.

## Goal

A new test suite that:

1. Renders a **curated ~10-test subset** of the existing visual tests using one
   or more **previously-published** remote versions (old `RemoteRoot` + old
   remote components), wired to the **current** host renderer.
2. Screenshot-compares each against the **current shared baseline**
   (`<Name>-<browser>-<os>.png`).
3. Runs in the **scheduled** visual workflow only (not per-PR).

A diff means the current host changed how a *fixed* old remote bundle renders —
i.e. a backwards-compatibility regression, **or** a legitimately-changed prop
contract that the old version does not send. Either way it is a signal worth a
human look.

### Non-goals

- Not per-PR / not PR-blocking (kept out of `affected:test:browser`).
- Not the full ~872-screenshot suite — a representative subset only.
- No new baseline set: cross-version runs assert against the *existing* shared
  baselines (see "Why the shared baseline works").
- The *identical-version* case from the issue is already covered by the existing
  `Remote` environment and is out of scope here.

## Why the shared baseline works

The rendered pixels are produced by the **current host's** Flow components — the
old remote package only *sends element props* over the connection. So an old
remote produces **identical** output to the current remote **as long as its prop
contract matches**. A pixel diff therefore appears precisely when an old version
sends different or missing props for a component the current host renders —
exactly the backwards-compatibility signal we want. This mirrors how `Local` and
`Remote` already share one baseline today.

## Architecture

Four pieces, smallest-surface-first.

### 1. Version resolver — `resolveCrossVersionTargets` (pure, unit-tested)

A pure function:
`(currentVersion, publishedVersions[], excludedVersions[]) => ResolvedTarget[]`,
where `ResolvedTarget = { category, version }`.

**Excluded versions.** Specific published versions can be marked as *excluded*
— e.g. a known-broken release that should never be tested against. Excluded
versions are removed from the candidate pool **before** the categories/offsets
are resolved, so each category naturally lands on the next valid candidate
(e.g. "previous" skips a broken version and picks the next-nearest below current;
an offset that would land on an excluded version steps to the next). The
exclude list is a checked-in, commented config (`cross-version.exclude.json`,
`{ version, reason }[]`) so each exclusion is documented and reviewable. If a
version is later fixed, removing it from the list re-includes it.

Implements the issue's semver categories:

- **previous** — nearest published version strictly below current.
- **firstOfLine** — first published version of the current patch/minor/major
  line.
- **latestOfPreviousLine** — latest published version of the previous
  patch/minor/major line.

*(The issue's "identical version" is covered by the existing `Remote`
environment and is not emitted here.)*

**Alpha-state detection & fallback.** When the published stream is a single
pre-release line so the semver categories collapse onto the same version(s)
— today's `0.2.0-alpha.*` — fall back to **computed offsets** relative to the
latest published version: `-10 / -100 / -200`. Detection rule: if applying the
semver categories yields fewer than 2 distinct versions **and** the current
version carries a pre-release tag, use offsets.

Results are **deduped**; any category/offset that cannot resolve (too few
published versions) is dropped and reported via `log`/console warning — never
silently truncated.

The function is pure over an injected `publishedVersions` list, so it is fully
deterministic and unit-testable. The single impure npm query lives in the
prepare step (below).

### 2. Install mechanism — manifest-driven

- New script `test:cross-version:prepare`:
  1. Reads the current version (`lerna.json`).
  2. Queries npm **once** for the published version list of
     `@mittwald/flow-remote-react-components`.
  3. Runs `resolveCrossVersionTargets`, passing the checked-in exclude list
     (`cross-version.exclude.json`).
  4. Writes **`cross-version.manifest.json`** (`{ category → version }`, plus
     resolved-at metadata).
  5. Installs each **distinct** resolved version into an isolated directory
     under `node_modules/.cross-version/<version>/`.
- The `cross-version` vitest config **reads the manifest** and dynamically
  generates:
  - `resolve.alias` entries mapping a virtual specifier per version
    (e.g. `@flr-crossversion/<version>`) to that version's installed
    `RemoteRoot` + remote components;
  - one **test environment** per resolved version.

This keeps the config free of static per-version alias slots and supports an
arbitrary number of resolved versions.

### 3. Test harness — extend the in-process pattern

Reuse `packages/remote-react-components/src/tests/lib/environments.tsx`. Today it
exports `testEnvironments = [localTestEnvironement, remoteTestEnvironement]`,
where `renderRemote` wires `<RemoteRenderer>` (host) to `<RemoteRoot>` (remote)
through one shared `RemoteReceiver`.

Add **version-sourced environments**: one per resolved version, each rendering
through the **old** package's `RemoteRoot` + remote components (via the virtual
alias) but the **current** host `RemoteRenderer`/`RemoteReceiver`. These are
generated from the manifest.

**Injectable environment list.** The ~10 subset test files must not hardcode
`testEnvironments`. They consume an injectable environment list so the *same*
file runs under either the normal set (regular `visual` project) or the
cross-version set (new `cross-version` project). Concretely: the environment
list is resolved from a small module whose value depends on the active vitest
project/mode, rather than being a hard `import { testEnvironments }`.

### 4. Subset selection — explicit include-list (option a)

A new vitest project **`cross-version`** with an **explicit include-list** of
~10 existing visual test files (the "smoke" subset — a representative pick across
component kinds: e.g. Button, Form, Modal, TextField, Markdown, …). No test
duplication. The subset is edited in one place (the project's include list).

## Wiring & CI

- New nx-discovered scripts in `packages/remote-react-components/package.json`:
  `test:cross-version`, `test:cross-version:prepare`, `test:cross-version:update`,
  `test:cross-version:dev` (mirroring the existing `test:visual*` family).
- nx metadata in `project.json` / `nx.json` `targetDefaults`:
  `test:cross-version` `dependsOn` `["^build", "test:cross-version:prepare"]`;
  `inputs` include the manifest and the installed `.cross-version` dirs; `cache`
  as appropriate. This keeps `nx affected` and caching correct.
- CI: add a job to **`.github/workflows/test-visual-scheduled.yml`** (all
  browsers, existing 3-attempt retry loop, Slack alert on failure). **Not** added
  to `affected:test:browser` — PR CI stays fast and free of npm resolution +
  old-version installs.
- Failing cross-version diffs follow the existing convention: `*--<env>--*.png`
  diff artifacts are written but **never committed**.

## Docs

Add a section to `packages/remote-react-components/CONTRIBUTE.md`:

- what cross-version smoke tests assert and why the shared baseline is used;
- how to run / update them locally (`test:cross-version*`);
- how the version manifest is resolved (semver categories + alpha-offset
  fallback) and how to interpret / refresh it.

## Testing this feature

- **Unit:** `resolveCrossVersionTargets` — semver categories, alpha-offset
  fallback, dedup, excluded-version skipping (candidate steps to the next valid
  version), and "too few versions" drop behaviour, over injected version lists.
- **Integration (implicit):** the cross-version project itself running the ~10
  subset against at least one resolved old version, green against the current
  baseline.

## Risks / open points for the plan

- **Old-bundle module resolution in Vitest browser mode.** Serving an old ESM
  bundle from `node_modules/.cross-version/<version>/` via Vite `resolve.alias`
  needs validation (Vite `optimizeDeps` / serving files, dependency graph of the
  old package). This is the trickiest part and should be spiked first in the
  implementation plan.
- **Network in the prepare step.** The npm query makes `:prepare` network-bound;
  acceptable because it runs in the scheduled workflow, not per-PR. The manifest
  makes the *test run itself* deterministic once prepared.
- **Subset drift.** The ~10 include-list is maintained by hand; document the
  intent (representative coverage) so it is curated, not ad hoc.
