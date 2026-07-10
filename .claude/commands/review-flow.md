---
description: Review changes against the Flow patterns and CI gates (AGENTS.md)
argument-hint: [base ref — defaults to uncommitted changes, else merge-base with main]
---

Review the current changes against this repository's documented patterns.

## Scope

Determine the diff to review:

- If `$ARGUMENTS` names a base (branch, commit, PR ref), diff against that.
- Otherwise: review uncommitted changes if any exist, else the current
  branch's diff against its merge-base with `main`.

## Method

1. Read the rules — they are the single source of truth; do not invent
   criteria beyond them:
   - `AGENTS.md` (root): generated code, Definition of Done, hard rules,
     workflow
   - `packages/components/AGENTS.md` when components are touched: patterns
     (flowComponent, PropsContext, views, styling, testing bar, i18n, public
     API surfaces)
   - the nearest `packages/*/AGENTS.md` / `apps/*/AGENTS.md` for every other
     touched package
2. Check the diff against those sections. Pay special attention to:
   - **Generated code:** were `@flr-generate` component props, icons, or prop
     JSDoc changed without regenerating and committing the artifacts? CI
     enforces `git diff --exit-code`.
   - **Backwards compatibility:** are props of `@flr-generate` /
     `flr-universal` components changed in a breaking way? Renames/removals
     need a `useWarnDeprecation` path instead.
   - **Definition of Done** for component work: story, docs page, tests along
     the testing bar, locales (both `de-DE` and `en-US`), `public.ts` export,
     remote demo page — list what is missing.
   - **Patterns:** flowComponent usage, PropsContext rules (remote-capable
     components only), views for internal composition in flr-universal
     components, token-based styling (no hard-coded values).
3. Verify each finding against the actual code before reporting — read the
   file; never report from the diff hunk alone.

## Report

Group findings by severity:

- **Blocking** — would fail CI or break the extension contract
- **Should fix** — violates a documented pattern or DoD item
- **Nit** — style/polish

For each finding: `file:line`, what is wrong, and which AGENTS.md section it
violates. If everything holds, say so explicitly. For component work, end
with the Definition-of-Done checklist status.
