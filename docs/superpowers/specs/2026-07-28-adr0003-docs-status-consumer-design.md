# Design — `apps/docs` component-status consumer (ADR 0003 §5)

- **Date:** 2026-07-28
- **Author:** Flow team (m.falkenberg@mittwald.de)
- **Spec type:** implementation design for the documentation consumer of the
  component lifecycle status registry.
- **Depends on:** [ADR 0003](../../adr/0003-component-lifecycle-status.md) and its
  registry foundation, shipping on branch `claude/adr003-write-plan-97787f`
  ([PR #2729](https://github.com/mittwald/flow/pull/2729), still open).

## Goal

Make each component's lifecycle status (`beta` / `stable` / `deprecated`, plus
an orthogonal `new` flag) visible in the documentation site, reading the
generated status registry and nothing else. Per ADR 0003 §5, no status is
re-derived from JSDoc in the docs app — the registry is the single source.

## Scope

**In scope (all four rendered effects from ADR §5):**

1. **Title badge** — badge on the component page's H1.
2. **Navigation badge** — badge next to component names in the sidebar.
3. **Beta and Deprecated callouts** — on the component page.
4. **Navigation ordering** — deprecated components sorted to the bottom of their
   category.

**Out of scope (tracked as follow-ups):**

- The user-facing page explaining what Beta / Neu / Veraltet mean for extension
  developers (ADR §5 / Follow-ups). Separate plan.
- The Storybook global decorator (ADR §5). Separate sibling consumer.
- Any change to the registry, its generator, or the `/internal` export — this
  spec only *consumes* what #2729 ships.

## Registry API this consumes (as shipped in #2729 at time of writing)

From `@mittwald/flow-react-components/internal`:

```ts
interface FlowComponentStatus {
  level: "beta" | "stable" | "deprecated";
  isNew: boolean;
  deprecationNotice?: string; // migration text from component-level @deprecated
}

// keyed by "<import-specifier>#<exportName>", e.g.
//   "@mittwald/flow-react-components#Button"
//   "@mittwald/flow-react-components/nextjs#Link"
const flowComponentStatus: Record<string, FlowComponentStatus>;

type FlowExportEntry =
  | "." | "flr-universal" | "nextjs" | "react-hook-form" | "password-tools";

// builds "<specifier>#<name>"; defaults to the main "." surface; fail-silent.
function getFlowComponentStatus(
  name: string,
  entry?: FlowExportEntry,
): FlowComponentStatus | undefined;
```

Two facts drive the design:

- **`deprecationNotice` lives in the registry.** The migration text is already
  derived by the generator. The docs app does **not** read `doc-properties.json`
  for status — earlier handoff notes about a "two-source" problem are obsolete.
- **Docs component pages document the main `.` surface.** `frontmatter.component`
  holds the plain PascalCase display name (verified: `component: Chat`,
  `component: MessageThread`, `component: Link`). So `getFlowComponentStatus(name)`
  with the default `entry` (`"."`) is the correct lookup for a docs page. No
  frontmatter change and no surface plumbing is needed.

### Current registry data (reality check)

133 entries across five surfaces. The only non-`stable` entries today are
`nextjs#Link` and `nextjs#LinkProvider` (both `deprecated`). The documented
`.#Link` is `stable`, and the deprecated `nextjs` exports have no standalone
docs component page. **Therefore nothing renders visibly with today's data.**
The consumer must render correctly for whatever the registry says, so
verification uses a temporarily-stubbed beta/new/deprecated entry (see
Verification).

## Architecture

Three layers, each independently understandable and testable.

### 1. Data adapter — the single seam

New module `apps/docs/src/lib/componentStatus/`.

- `getComponentStatusInfo(name: string): FlowComponentStatus | undefined`
  - Delegates to `getFlowComponentStatus(name)` (default `.` surface).
  - Fail-silent: returns `undefined` for any unknown name (never a wrong badge).
  - This is the **only** place in the docs app that imports the registry from
    `/internal`, so the dependency edge and the fail-silent rule live in one
    spot.
- `statusPresentation.ts` — presentation constants (German, hardcoded to match
  the German docs site):
  - Labels: `beta → "Beta"`, `new → "Neu"`, `deprecated → "Veraltet"`.
  - Badge colors: `beta → "violet"`, `new → "green"`, `deprecated → "orange"`.
  - Callout copy (see §3).

Rationale for a thin adapter over calling `getFlowComponentStatus` directly:
it centralizes the import, pins the default surface, and gives the two
presentational components one stable, docs-local contract to depend on.

### 2. Presentational components (compose Flow only, no ad-hoc CSS)

Both are dumb: given a component name they resolve status via the adapter and
render Flow components. Both render `null` when the adapter returns `undefined`
or `stable`-with-no-`new`.

- **`ComponentStatusBadge({ name })`** — renders **up to two** Flow `Badge`s,
  because `level` and `isNew` are orthogonal:
  - a level badge for `beta`/`deprecated` (none for `stable`), **and**
  - a `Neu` badge when `isNew`.
  - A `beta` + `new` component shows both `Beta` and `Neu`. Badges are laid out
    with Flow layout primitives (no custom flex/CSS).
- **`ComponentStatusCallout({ name })`** — renders **at most one** Flow `Alert`
  (levels are mutually exclusive):
  - `beta` → `<Alert status="info">` with the semver-exemption notice.
  - `deprecated` → `<Alert status="warning">` carrying `deprecationNotice`, or a
    generic German fallback when it is absent.
  - `stable` / `new`-only → nothing (New has no callout).
  - Text wrapped in Flow `Heading`/`Content`/`Text` per the `Alert` API.

### 3. Wiring — three touch points

- **`apps/docs/src/app/_components/layout/TopContent/TopContent.tsx`**
  (title + callout; shared across the overview/develop/guidelines tabs, so both
  show on every tab). Guard on the existing `component` frontmatter value:
  - `<ComponentStatusBadge name={component} />` adjacent to the `Heading` (H1),
    placed with Flow layout primitives.
  - `<ComponentStatusCallout name={component} />` directly under the description.
- **`apps/docs/src/app/_components/layout/MainNavigation/MainNavigation.tsx`**
  (`"use client"`; the registry is static JSON, safe on the client):
  - `NavigationLink` — render `<ComponentStatusBadge name={…} />` after the nav
    title.
  - `NavigationSection` — for a components category, sort entries so
    `deprecated` ones fall to the bottom; order is otherwise unchanged (New is
    badge-only, no reorder; no hide-toggle).

Component-name resolution in the nav is from the `MdxFile` tree item's
`frontmatter.component`; when absent, fail-silent (no badge, natural order).

## German copy (draft — for review)

- **Beta callout** (`status="info"`), heading + body:
  - Heading: `Beta`
  - Body: „Diese Komponente befindet sich in der Beta-Phase. Ihre API ist von der
    Stabilitätsgarantie ausgenommen und kann sich auch in Minor- oder
    Patch-Releases noch ändern."
- **Deprecated callout** (`status="warning"`):
  - Heading: `Veraltet`
  - Body: the registry's `deprecationNotice`, rendered as the migration hint.
    Fallback when absent: „Diese Komponente ist veraltet und wird in einer
    zukünftigen Version entfernt."
- **Badge labels:** `Beta`, `Neu`, `Veraltet`.

## Testing & verification

- **Unit tests** (`apps/docs`, colocated with the module):
  - adapter: fail-silent on unknown name; passes through `level`/`isNew`/
    `deprecationNotice`.
  - badge logic: `stable` → nothing; `beta` → one badge; `beta` + `new` → two
    badges; `deprecated` → one badge.
  - callout logic: `beta` → info callout; `deprecated` with notice → warning
    callout carrying that text; `deprecated` without notice → generic fallback;
    `new`-only / `stable` → nothing.
- **Manual verification:** `pnpm nx dev docs` (bare `pnpm nx`, not
  `corepack pnpm nx` — nested-spawn footgun; use the nx target so workspace deps
  rebuild). With today's data nothing shows, so temporarily stub a
  beta/new/deprecated entry to eyeball the title badge, nav badge, both
  callouts, and the nav deprecated-to-bottom sort; revert the stub before
  finishing.
- **Visual regression:** proactively add the `run-visual-tests` PR label (docs
  render change; verify-only).

## Branching

The docs consumer imports `#2729`'s `/internal` exports. Branch off `main` once
#2729 merges; if it has not merged, branch off `claude/adr003-write-plan-97787f`.
Code, commits, and this spec are in English; user-facing docs copy is German.

## Implementation-time verifications (carry into the plan)

1. **Nav name source** — confirm the `MdxFile` tree item in `MainNavigation`
   exposes `frontmatter.component` (or derive the display name reliably);
   fail-silent otherwise.
2. **`/internal` reachability** — confirm the docs app resolves
   `@mittwald/flow-react-components/internal` (it already imports
   `/doc-properties`); the export exists in the package `exports` map.
3. **Layout of the title badge** — place inline with the H1 using Flow layout
   primitives only, no ad-hoc CSS.
```
