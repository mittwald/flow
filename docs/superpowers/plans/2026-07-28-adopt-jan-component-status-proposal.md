# Adopt Jan's Component Status Proposal (ADR 0003) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the first real set of ADR 0003 per-component lifecycle-status annotations, following Jan Eimertenbrink's proposal from [RFC #2711](https://github.com/mittwald/flow/issues/2711#issuecomment-5107231206), and regenerate the committed status registry.

**Architecture:** Status is authored as component-level JSDoc (`@flowStatus beta|new` and, for deprecation, the standard `@deprecated` tag). A build-time generator (`build:status-registry`) parses `doc-properties.json`, derives each component's status via `deriveComponentStatus`, and writes the committed artifacts `src/status/component-status.json` + `src/status/componentStatus.ts`. This plan only edits JSDoc and regenerates — no logic changes.

**Tech Stack:** TypeScript, react-docgen-typescript (tag capture), nx targets, pnpm.

## Global Constraints

- **Never hand-edit generated files.** `packages/components/src/status/component-status.json` and `componentStatus.ts` are generated — only ever change them by running the generator and committing the result.
- **Regeneration command:** `pnpm nx build:status-registry components` (bare `pnpm nx`, not `corepack pnpm nx`, because it is a dependency-graph target — it runs `build:docs-properties` first). See root `AGENTS.md`.
- **CI gate:** the "Check all generated code is committed" step runs `git diff --exit-code` after building. Regenerated artifacts MUST be committed.
- **Conventional Commits**, component scope: `feat(components): …`.
- **Authoring syntax (ADR 0003 §3):** `beta`/`new` via `@flowStatus` (comma-separated tokens); `deprecated` via the standard `@deprecated` tag (never via `@flowStatus`). Omitting all yields `stable`.
- **Do not touch** `src/status/types.ts`, the generator, or `deriveComponentStatus.ts` — the mechanism already works; this is a pure authoring change.

## Proposal → mapping (source of truth for this plan)

| Component | Registry key | Status to author | JSDoc |
| --- | --- | --- | --- |
| Accordion | `@mittwald/flow-react-components#Accordion` | Beta | `@flowStatus beta` |
| AccentBox | `@mittwald/flow-react-components#AccentBox` | Beta | `@flowStatus beta` |
| CodeEditor | `@mittwald/flow-react-components#CodeEditor` | New | `@flowStatus new` |
| ImageCropper | `@mittwald/flow-react-components#ImageCropper` | New | `@flowStatus new` |
| Kbd | `@mittwald/flow-react-components#Kbd` | New | `@flowStatus new` |
| FormRootError | `@mittwald/flow-react-components/react-hook-form#FormRootError` | New | `@flowStatus new` |
| SegmentedControl | `@mittwald/flow-react-components#SegmentedControl` | Deprecated | `@deprecated <text>` — **BLOCKED, see Task 3** |
| TabNavigation | — | New | **Excluded** — component does not exist yet (issue #2680). See "Open items". |

All eight currently resolve to `{ "level": "stable", "isNew": false }`.

**Decisions already made (do not re-litigate):**
- CodeEditor is **New**, not Beta (follows Jan). The ADR's non-binding seed list has been dropped from §7.
- TabNavigation is **excluded** until it lands (#2680 / PR #2634); a note was posted on the PR to tag it `new`.
- SegmentedControl deprecation is **blocked** pending Jan's migration-text reply (question already posted on RFC #2711).

---

### Task 1: Beta annotations (Accordion, AccentBox)

**Files:**
- Modify: `packages/components/src/components/Accordion/Accordion.tsx:22`
- Modify: `packages/components/src/components/AccentBox/AccentBox.tsx:58`
- Regenerate (do not hand-edit): `packages/components/src/status/component-status.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: registry entries `@mittwald/flow-react-components#Accordion` and `#AccentBox` become `{ "level": "beta", "isNew": false }`. Task 2 regenerates the same file, cumulatively; these entries must remain `beta` afterwards.

- [ ] **Step 1: Add `@flowStatus beta` to Accordion**

In `Accordion.tsx`, replace the single-line JSDoc (line 22) above `export const Accordion`:

```tsx
/**
 * @flr-generate all
 * @flowStatus beta
 */
export const Accordion: FC<AccordionProps> = flowComponent(
```

- [ ] **Step 2: Add `@flowStatus beta` to AccentBox**

In `AccentBox.tsx`, replace the single-line JSDoc (line 58) above `export const AccentBox`:

```tsx
/**
 * @flr-generate all
 * @flowStatus beta
 */
export const AccentBox = flowComponent("AccentBox", (props) => {
```

- [ ] **Step 3: Regenerate the status registry**

Run: `pnpm nx build:status-registry components`
Expected: succeeds, prints `✅  Done — <N> entries in the registry`.

- [ ] **Step 4: Verify the two entries flipped to beta**

Run:
```bash
node -e "const d=require('./packages/components/src/status/component-status.json'); ['Accordion','AccentBox'].forEach(n=>console.log(n, JSON.stringify(d['@mittwald/flow-react-components#'+n])));"
```
Expected:
```
Accordion {"level":"beta","isNew":false}
AccentBox {"level":"beta","isNew":false}
```

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/components/Accordion/Accordion.tsx \
        packages/components/src/components/AccentBox/AccentBox.tsx \
        packages/components/src/status/component-status.json
git commit -m "feat(components): mark Accordion and AccentBox as beta (ADR 0003)"
```

---

### Task 2: New annotations (CodeEditor, ImageCropper, Kbd, FormRootError)

**Files:**
- Modify: `packages/components/src/components/CodeEditor/CodeEditor.tsx:37`
- Modify: `packages/components/src/components/ImageCropper/ImageCropper.tsx:27`
- Modify: `packages/components/src/components/Kbd/Kbd.tsx:23`
- Modify: `packages/components/src/integrations/react-hook-form/components/FormRootError/FormRootError.tsx:6`
- Regenerate (do not hand-edit): `packages/components/src/status/component-status.json`

**Interfaces:**
- Consumes: the beta entries produced by Task 1 (they must survive this task's regeneration unchanged).
- Produces: the four registry entries become `{ "level": "stable", "isNew": true }` (New = `isNew: true` on the `stable` ladder — still bound by the breaking-change promise).

- [ ] **Step 1: Add `@flowStatus new` to CodeEditor**

In `CodeEditor.tsx`, replace the single-line JSDoc (line 37) above `export const CodeEditor`:

```tsx
/**
 * @flr-generate all
 * @flowStatus new
 */
export const CodeEditor = flowComponent("CodeEditor", (props) => {
```

- [ ] **Step 2: Add `@flowStatus new` to ImageCropper**

In `ImageCropper.tsx`, replace the single-line JSDoc (line 27) above `export const ImageCropper`:

```tsx
/**
 * @flr-generate all
 * @flowStatus new
 */
export const ImageCropper: FC<ImageCropperProps> = (props) => {
```

- [ ] **Step 3: Add `@flowStatus new` to Kbd**

In `Kbd.tsx`, replace the single-line JSDoc (line 23) above `export const Kbd`:

```tsx
/**
 * @flr-generate all
 * @flowStatus new
 */
export const Kbd = flowComponent("Kbd", (props) => {
```

- [ ] **Step 4: Add a component-level JSDoc block with `@flowStatus new` to FormRootError**

`FormRootError.tsx` has **no** existing JSDoc block. Insert one directly above `export const FormRootError` (line 6):

```tsx
/**
 * @flowStatus new
 */
export const FormRootError: FC = () => {
```

- [ ] **Step 5: Regenerate the status registry**

Run: `pnpm nx build:status-registry components`
Expected: succeeds, prints `✅  Done — <N> entries in the registry`.

- [ ] **Step 6: Verify the four New entries and that Task 1's beta entries survived**

Run:
```bash
node -e "const d=require('./packages/components/src/status/component-status.json'); const k='@mittwald/flow-react-components'; [[k+'#CodeEditor'],[k+'#ImageCropper'],[k+'#Kbd'],[k+'/react-hook-form#FormRootError'],[k+'#Accordion'],[k+'#AccentBox']].forEach(([key])=>console.log(key, JSON.stringify(d[key])));"
```
Expected:
```
@mittwald/flow-react-components#CodeEditor {"level":"stable","isNew":true}
@mittwald/flow-react-components#ImageCropper {"level":"stable","isNew":true}
@mittwald/flow-react-components#Kbd {"level":"stable","isNew":true}
@mittwald/flow-react-components/react-hook-form#FormRootError {"level":"stable","isNew":true}
@mittwald/flow-react-components#Accordion {"level":"beta","isNew":false}
@mittwald/flow-react-components#AccentBox {"level":"beta","isNew":false}
```

- [ ] **Step 7: Typecheck (JSDoc-only change must not break compile)**

Run: `pnpm nx test:compile components`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/components/CodeEditor/CodeEditor.tsx \
        packages/components/src/components/ImageCropper/ImageCropper.tsx \
        packages/components/src/components/Kbd/Kbd.tsx \
        packages/components/src/integrations/react-hook-form/components/FormRootError/FormRootError.tsx \
        packages/components/src/status/component-status.json
git commit -m "feat(components): flag CodeEditor, ImageCropper, Kbd, FormRootError as new (ADR 0003)"
```

---

### Task 3: SegmentedControl → Deprecated — BLOCKED on Jan's reply

**Status:** BLOCKED. A clarifying question about the migration text was posted at
[RFC #2711 comment](https://github.com/mittwald/flow/issues/2711#issuecomment-5107231206).
Do **not** implement this task until Jan supplies the exact `@deprecated` message
(the text becomes both the IDE/TS deprecation hint and the docs "Deprecated" callout).

**Files:**
- Modify: `packages/components/src/components/SegmentedControl/SegmentedControl.tsx:25`
- Regenerate (do not hand-edit): `packages/components/src/status/component-status.json`

**Interfaces:**
- Consumes: the beta + new entries from Tasks 1–2 (must survive regeneration).
- Produces: `@mittwald/flow-react-components#SegmentedControl` becomes `{ "level": "deprecated", "isNew": false, "deprecationNotice": "<Jan's text>" }`.

- [ ] **Step 1: Confirm Jan's migration text is available**

Do not proceed without a concrete replacement message from Jan. Substitute it verbatim for `<JAN_MIGRATION_TEXT>` in Step 2.

- [ ] **Step 2: Add a component-level `@deprecated` tag to SegmentedControl**

In `SegmentedControl.tsx`, replace the single-line JSDoc (line 25) above `export const SegmentedControl`:

```tsx
/**
 * @flr-generate all
 * @deprecated <JAN_MIGRATION_TEXT>
 */
export const SegmentedControl = flowComponent("SegmentedControl", (props) => {
```

Note: `deprecated` is authored via the standard `@deprecated` tag, **not** `@flowStatus` (ADR 0003 §3). A component-level `@deprecated` sets `level: "deprecated"` and populates `deprecationNotice` from the tag text.

- [ ] **Step 3: Regenerate the status registry**

Run: `pnpm nx build:status-registry components`
Expected: succeeds.

- [ ] **Step 4: Verify the entry and its notice**

Run:
```bash
node -e "const d=require('./packages/components/src/status/component-status.json'); console.log(JSON.stringify(d['@mittwald/flow-react-components#SegmentedControl'],null,2));"
```
Expected: `level` is `"deprecated"`, `isNew` is `false`, and `deprecationNotice` equals Jan's text.

- [ ] **Step 5: Check no internal usage now trips the compile/lint deprecation gate**

Run: `pnpm nx test:compile components` and `pnpm lint`
Expected: PASS. A component-level `@deprecated` marks all internal `SegmentedControl` usages (stories, tests) as deprecated. If a lint rule flags them, either suppress at the usage site with a short justification or migrate the usage — decide with Jan's replacement guidance. Do not weaken the tag to silence the warning.

- [ ] **Step 6: Commit**

```bash
git add packages/components/src/components/SegmentedControl/SegmentedControl.tsx \
        packages/components/src/status/component-status.json
git commit -m "feat(components): deprecate SegmentedControl (ADR 0003)"
```

---

### Task 4: Final CI-mirror verification & PR

**Files:** none (verification + PR only).

- [ ] **Step 1: Mirror the CI "generated code is committed" gate**

Run:
```bash
pnpm build && git diff --exit-code
```
Expected: exit code 0 (no uncommitted generated changes). If anything is dirty (e.g. `component-status.json`, `dist/assets/doc-properties.json`, or a `view.ts`), commit it — a JSDoc change can ripple into other committed generated artifacts.

- [ ] **Step 2: Run the affected unit tests**

Run: `pnpm affected:test`
Expected: PASS (in particular `deriveComponentStatus` and `buildStatusRegistry` suites).

- [ ] **Step 3: Open the PR**

```bash
git push -u origin claude/jans-component-status-proposal-7d7ee3
gh pr create --base main --title "feat(components): adopt component lifecycle statuses (ADR 0003)" \
  --body "Adopts Jan's status proposal from #2711 as the first ADR 0003 annotations.

- Beta: Accordion, AccentBox
- New: CodeEditor, ImageCropper, Kbd, FormRootError

SegmentedControl (deprecated) and TabNavigation (new) are deferred — see the plan's Open items.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

If Task 3 is still blocked at PR time, ship Tasks 1–2 only and note SegmentedControl as a follow-up in the PR body.

---

## Open items (not implemented by this plan)

- **SegmentedControl deprecation** — Task 3, blocked on Jan's migration text ([question posted](https://github.com/mittwald/flow/issues/2711#issuecomment-5107231206)). Implement once he replies.
- **TabNavigation → New** — the component does not exist yet (issue [#2680](https://github.com/mittwald/flow/issues/2680), PR [#2634](https://github.com/mittwald/flow/pull/2634)). A [note was posted on PR #2634](https://github.com/mittwald/flow/pull/2634#issuecomment-5107708587) to add `@flowStatus new` when it lands.

## Self-review notes

- **Spec coverage:** all six annotatable components from Jan's proposal are covered (Tasks 1–2); the two non-annotatable items (SegmentedControl blocked, TabNavigation absent) are explicitly tracked.
- **Mechanism verified:** generator reads `tags.flowStatus` / `tags.deprecated`; `doc-properties.json` already captures custom component-level tags (`flr-generate: "all"` present today), so `@flowStatus`/`@deprecated` will surface.
- **No hand-editing generated files:** every registry change goes through `build:status-registry`, committed to satisfy the `git diff --exit-code` CI gate.
