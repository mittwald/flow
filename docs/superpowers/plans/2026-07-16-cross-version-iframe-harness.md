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

## Task R0b: Exclude the broken version window (DONE — no threads patch)

**Superseded diagnosis:** An earlier hypothesis blamed a missing pnpm patch (`npm install --prefix` skips `patchedDependencies`) for the spike's `DataCloneError`. That was wrong. The real cause: **alpha.889–895 are genuinely broken published releases.** PR #2596 (first shipped in **alpha.889**) made `FlowThreadSerialization` async, but `@quilted/threads` was still externalized (not bundled) until PR #2620 (**alpha.896**, `vite.build.config.ts` `externalizeDeps({ except: ["@quilted/threads"] })`). So alpha.889–895 ship async serializers against an externalized, unpatched threads and `DataCloneError` on connect for any consumer without a pnpm-patched threads. Versions ≤ alpha.888 predate async serializers (sync, safe); versions ≥ alpha.896 bundle the patched threads (safe).

**Resolution (done, commit `a17adeae4`):** No threads patch and no threads alias. The broken window is added to `cross-version.exclude.json` (`889, 891, 892, 893, 894, 895`; 890 was never published). The resolver's exclude-stepping moves offset targets off the broken window automatically. Re-running prepare yields safe targets (e.g. `offset-10=883, offset-100=791, offset-200=686`, all pre-#2596).

- [x] Broken window excluded in `cross-version.exclude.json` with documented reasons.
- [x] `prepare` re-run → manifest holds only safe (non-broken, installable) versions.
- [ ] Confirm via the iframe spike that a clean pre-#2596 version (e.g. 883) connects and passes props with **no** threads patch (in progress).

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

## Task R2: Remote entries + host HTML-output comparison + references

**Decision:** Start with **HTML/DOM-output comparison**, not screenshots. Comparing the host-rendered HTML is deterministic (no pixel/rendering-environment fragility, no per-browser/OS PNGs), needs no stability settings, and directly catches what this harness is for — prop/attribute serialization drift (`data-testid`, `disabled`, variant attributes all appear in the DOM). Screenshots can be layered on later.

**Files (create):** under `e2e/cross-version/`:
- `entries.browser.test.remote.tsx` — one exported render function per representative component/scenario (Button states, Checkbox states, Icon sizes/status, TextField, Badge, etc.), importing components from the package specifier `@mittwald/flow-remote-react-components`.
- `entries.browser.test.tsx` — host test: for each entry, render `<RemoteRenderer src="http://localhost:<port>/?file=…&test=<entry>">` in a container, wait for connection (loading-view poll from `renderRemoteTest.tsx`), then capture the host-rendered **HTML** (the container's `innerHTML` of the `RemoteRootRenderer` output), **normalize** it (see below), and `expect(normalizedHtml).toMatchFileSnapshot("__html__/<entry>.html")`.
- `normalizeHtml.ts` — strips volatile, non-semantic attributes so the comparison is stable and version-independent: React-generated ids (`id="react-aria-…"`, `aria-labelledby`/`aria-controls` pointing at them), `data-flr-version`/`data-flr-initialized`, and insignificant whitespace. Keep semantic attributes (roles, `data-testid`, `disabled`, `aria-disabled`, class names, text). Unit-test this pure function.
- `vitest.config.ts` for the cross-version e2e suite — browser mode, webkit, `fileParallelism:false`, globalSetup starting the R1 server.

**Interfaces:** The snapshot file path is **version-independent** (`__html__/<entry>.html`), so every version + the current reference share one reference file per entry. A diff = the old bundle produces different host HTML than current = a real prop/serialization/structure backwards-compat signal.

- [ ] **Step 1:** Write `normalizeHtml` (+ unit test), ~10 entries, the host test, and the config.
- [ ] **Step 2:** Generate the reference HTML from the CURRENT version through the iframe (`FLOW_CROSS_VERSION`=current workspace/published version, `--update`/first-run writes the `__html__/*.html` files). Commit them.
- [ ] **Step 3:** Run against an OLD version (883) and confirm props render (proving the pivot) and the normalized HTML matches the reference where the API is unchanged. A real diff = a legitimate backwards-compat finding (drop that entry or record it), NOT something to force-green.
- [ ] **Step 4:** Commit `feat(remote-react-components): add cross-version html-output comparison + references`.

---

## Task R3: Version-loop run script + curation + nx/CI/docs wiring

**Files:** `package.json` scripts; `project.json`/`nx.json`; `.github/workflows/test-visual-scheduled.yml`; `CONTRIBUTE.md`.

- [ ] **Step 1:** Add a `test:cross-version` script that loops the manifest versions, setting `FLOW_CROSS_VERSION` for each and running the R2 vitest config; plus `test:cross-version:update` (regenerate the `__html__` references from the current version) and `test:cross-version:dev`. Depends on `test:cross-version:prepare`.
- [ ] **Step 2:** Empirically curate the entry set to ~10 that match the reference across all installed old versions (props now work, so far more components are viable than the in-process attempt's 4). Record dropped entries + reason.
- [ ] **Step 3:** nx wiring (`dependsOn`, `inputs` incl. manifest + install dir, `outputs`), mirroring Task 7 of the original plan.
- [ ] **Step 4:** CI job in `test-visual-scheduled.yml` (scheduled-only, retry loop + Slack). Measure cold-cache behavior; budget a discarded warm-up run only if needed.
- [ ] **Step 5:** `CONTRIBUTE.md` section — honest scope (full old remote stack vs current host over the real connection; HTML-output comparison, not screenshots yet), how to run/update the `__html__` references, version manifest + broken-window exclude list.
- [ ] **Step 6:** Commit in logical chunks.

---

## Self-review
- Prop-level compat now genuinely tested (spike-proven). ✓
- HTML-output comparison (deterministic) chosen over screenshots for the first cut; screenshots deferred. ✓
- Reference strategy: current-version-through-iframe HTML, shared per entry, version-independent path. ✓
- Broken-version window (alpha.889–895) excluded; no threads handling needed (R0b). ✓
- In-process artifacts removed (R0a). ✓
- Scheduled-only, git-ignored install artifacts, honest docs. ✓
- Open risk: cold-cache warm-up (carry from Task 5; the e2e server's `optimizeDeps.force` may change the picture — R2/R3 to measure).
