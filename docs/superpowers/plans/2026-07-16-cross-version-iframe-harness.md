# Cross-version remote smoke tests — e2e iframe harness (revised plan)

> Supersedes Tasks 4–6 of `2026-07-15-cross-version-remote-smoke-tests.md`. Tasks 1–3 (resolver, exclude, prepare) stand, with one amendment (R0b). Tasks 7–9 (nx, CI, docs) adapt to the new scripts/paths.
> **For agentic workers:** executed via superpowers:subagent-driven-development. Steps use `- [ ]`.

**Why the pivot:** The in-process harness silently dropped every non-`children` prop (it had to alias old `flow-remote-elements`→current to avoid a same-realm `customElements.define` collision, which broke prop-passing). A spike proved the **e2e HTTP-iframe harness** renders an old version in a **separate document/realm** connected to the current host over the real `@quilted/threads` connection, and props serialize correctly (`data-testid` + `isDisabled` verified on old alpha.889). That is the real production path.

**Baseline strategy (revised):** The reference is the **current version rendered through the same iframe harness** (the iframe analog of the earlier "current shared baseline"). Old versions compare against those committed baselines. Screenshot files key on the **description string** (not the version), so all versions and the current reference share one baseline; a diff = old bundle renders differently than current through the current host = a real prop/serialization backwards-compat signal.

**What the harness now validates (honest scope, for docs):** OLD `flow-remote-react-components` (React/prop API) + OLD `flow-remote-core` (serialization) + OLD `flow-remote-elements`, running in a real iframe realm, connected to the CURRENT host over the versioned protocol. This is the full remote stack against the current host — materially stronger than the in-process attempt.

## Global Constraints
- Package `@mittwald/flow-remote-react-components`. Single-pkg cmds: `corepack pnpm --filter @mittwald/flow-remote-react-components <script>`; dependency-graph targets: bare `pnpm nx …`.
- Generated artifacts git-ignored: `cross-version.manifest.json`, `node_modules/.cross-version/`, any `.generated/`, screenshot diff artifacts (`*-actual-*.png`). Never commit them.
- Cross-version tests are scheduled-only.
- The spike's working scratch setup lives at `packages/remote-react-components/dev/cross-version-e2e-spike/` — read it; it is the reference implementation for R1/R2. Its report: `.superpowers/sdd/spike-iframe-report.md`.
- Conventional Commits, scope `remote-react-components`, English.

---

## Task R0a: Remove the superseded in-process harness

**Files (delete):** `dev/cross-version/vitest.config.ts`, `dev/cross-version/crossVersionEnvironmentsPlugin.ts`, `dev/cross-version/renderRemoteVersion.tsx`, `dev/cross-version/subset.ts`, `dev/cross-version/__spike__/` (untracked), `dev/cross-version-e2e-spike/` (untracked scratch — remove after R1/R2 land, not here).
**Keep:** `dev/cross-version/resolveCrossVersionTargets.ts` (+test), `dev/cross-version/prepare.ts`, `cross-version.exclude.json`.
**Files (modify):** `packages/remote-react-components/.gitignore` — remove the `dev/cross-version/.generated/` line (that dir is gone).

- [ ] **Step 1:** `git rm` the four tracked in-process files; `rm -rf` the untracked `dev/cross-version/__spike__/`.
- [ ] **Step 2:** Remove the `.generated/` gitignore line.
- [ ] **Step 3:** Confirm resolver test still passes: `corepack pnpm --filter @mittwald/flow-remote-react-components exec vitest run --project=unit-dev dev/cross-version/resolveCrossVersionTargets.test.ts` → PASS.
- [ ] **Step 4:** Commit `refactor(remote-react-components): remove in-process cross-version harness (superseded by iframe harness)`.

---

## Task R0b: Prepare script applies the threads patch

**Files:** Modify `dev/cross-version/prepare.ts`.

**Context:** `npm install --prefix` does not apply pnpm `patchedDependencies`, so each old install's nested `@quilted/threads@3.3.1` is missing the repo's load-bearing `patches/@quilted__threads@3.3.1.patch` (sync→async serialize/deserialize). Without it the remote↔host handshake throws `DataCloneError`. The patch requirement is identical for old and current versions (confirmed), so this is a harness-install gap.

**Interfaces:** After a successful install of a version, apply the patch to every `@quilted/threads@3.3.1` directory under that version's install tree.

- [ ] **Step 1:** In `installVersion` (after successful install, before returning `true`), locate the repo patch at `<repoRoot>/patches/@quilted__threads@3.3.1.patch` and apply it to each `.../node_modules/@quilted/threads` (and nested copies) inside `node_modules/.cross-version/<version>/`. Use `git apply --directory=<relPath> <patch>` or `patch -p1 -d <dir>`, guarding for already-applied (`git apply --check` first) and for versions whose threads differ from 3.3.1 (skip with a log). Wrap in try/catch — a patch failure should downgrade to a loud warning + skip that version (reuse the resilient-skip pattern), not crash.
- [ ] **Step 2:** Re-run prepare live; confirm it installs + patches the 3 targets, manifest still valid.
   Run: `corepack pnpm --filter @mittwald/flow-remote-react-components test:cross-version:prepare`
   Expected: 3 targets installed and patched, no `DataCloneError` when later used.
- [ ] **Step 3:** Add a resolver/prepare-adjacent note; commit `fix(remote-react-components): apply @quilted/threads patch to cross-version installs`.

---

## Task R1: Cross-version e2e test server (aliased to an old version)

**Files (create):** under `packages/remote-react-components/e2e/cross-version/`:
- `index.html`, `main.tsx` (mirror `e2e/remote-test-server/`, but import `RemoteRoot` from the package specifier `@mittwald/flow-remote-react-components/RemoteRoot` so the alias applies),
- `vite.config.ts` (extends base; per-version `resolve.alias` for `@mittwald/flow-remote-react-components` + `/RemoteRoot` → installed old version selected by `process.env.FLOW_CROSS_VERSION`, using the manifest + the `aliasPackageExports` technique from the old `dev/cross-version/vitest.config.ts` git history / the spike; `server.fs.allow` for `node_modules/.cross-version`; own port, e.g. `6099`, read from a single shared constant),
- `createServer.tsx` + `setupGlobal.ts` (mirror the e2e server lifecycle).

**Interfaces:** Server serves `main.tsx` which routes by `?file=&test=` (reuse the existing convention) and renders the selected remote entry inside the OLD `RemoteRoot`. Version chosen by `FLOW_CROSS_VERSION` env (default: first manifest target).

Base this task on the spike setup in `dev/cross-version-e2e-spike/` — it already solved the alias + fs.allow + optimizeDeps wiring for an old version. Generalize it from the single hardcoded 889 to `FLOW_CROSS_VERSION` + manifest.

- [ ] **Step 1:** Create the server + config, generalized over `FLOW_CROSS_VERSION`. Read the manifest to validate the version and resolve its install path; throw a clear error if the env version isn't in the manifest.
- [ ] **Step 2:** Smoke-run the server standalone (dev) and confirm it serves and that `?file=…&test=…` resolves a remote entry (a temporary trivial entry is fine).
- [ ] **Step 3:** Commit `feat(remote-react-components): add cross-version e2e test server`.

---

## Task R2: Remote entries + host screenshot test + baselines

**Files (create):** under `e2e/cross-version/`:
- `entries.browser.test.remote.tsx` — one exported render function per representative component/scenario (start from the same states the visual suite covers, e.g. Button states, Checkbox states, Icon sizes/status, TextField, Badge, etc.), importing components from the package specifier `@mittwald/flow-remote-react-components`.
- `screenshots.browser.test.tsx` — host test: for each entry, render `<RemoteRenderer src="http://localhost:<port>/?file=…&test=<entry>">` inside a fixed-size container (reuse `RootContainer`/`rootContainerLocator` pattern from `src/tests/lib/RootContainer.tsx`), wait for connection (loading-view poll from `renderRemoteTest.tsx`), neutral-pointer, then `expect(container).toMatchScreenshot("<entry description>", opts)`.
- `vitest.config.ts` for the cross-version e2e suite — browser mode, webkit, `fileParallelism:false`, **add screenshot-stability settings** (reduced motion, fixed 1280×720 viewport) since the e2e base config lacks them, globalSetup starting the R1 server.

**Interfaces:** Screenshot description strings are stable and version-independent → all versions + the current reference share one baseline file per description.

- [ ] **Step 1:** Write ~10 entries + the host screenshot test + config.
- [ ] **Step 2:** Generate the reference baselines from the CURRENT version through the iframe (run with `FLOW_CROSS_VERSION` set to the current workspace/published version in `--update` mode). Commit the baseline PNGs.
- [ ] **Step 3:** Run against an OLD version (e.g. 889) and confirm props render (proving the pivot) and it matches the current baseline where the API is unchanged. Investigate any diff — a real API/serialization drift is a legitimate finding (drop that entry from the set or record it), NOT something to force-green.
- [ ] **Step 4:** Commit `feat(remote-react-components): add cross-version screenshot entries + baselines`.

---

## Task R3: Version-loop run script + curation + nx/CI/docs wiring

**Files:** `package.json` scripts; `project.json`/`nx.json`; `.github/workflows/test-visual-scheduled.yml`; `CONTRIBUTE.md`.

- [ ] **Step 1:** Add a `test:cross-version` script that loops the manifest versions, setting `FLOW_CROSS_VERSION` for each and running the R2 vitest config; plus `test:cross-version:update` (reference baselines) and `test:cross-version:dev`. Depends on `test:cross-version:prepare`.
- [ ] **Step 2:** Empirically curate the entry set to ~10 that render green across all installed old versions (props now work, so far more components are viable than the in-process attempt's 4). Record dropped entries + reason.
- [ ] **Step 3:** nx wiring (`dependsOn`, `inputs` incl. manifest + install dir, `outputs`), mirroring Task 7 of the original plan.
- [ ] **Step 4:** CI job in `test-visual-scheduled.yml` (scheduled-only, all browsers, retry loop + Slack). Budget one discarded cold-cache warm-up run before the assertion run.
- [ ] **Step 5:** `CONTRIBUTE.md` section — honest scope (full old remote stack vs current host over the real connection), how to run/update, version manifest + threads-patch note, exclude list.
- [ ] **Step 6:** Commit in logical chunks.

---

## Self-review
- Prop-level compat now genuinely tested (spike-proven). ✓
- Baseline strategy restated for the iframe path (current-through-iframe reference). ✓
- threads-patch install gap handled (R0b). ✓
- In-process artifacts removed (R0a). ✓
- Scheduled-only, git-ignored artifacts, honest docs. ✓
- Open risk: cold-cache warm-up (carry from Task 5; the e2e server's `optimizeDeps.force` may change the picture — R2/R3 to measure).
