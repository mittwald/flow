# Docs Component-Status Consumer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface each Flow component's lifecycle status (`beta`/`stable`/`deprecated` + `new`) in `apps/docs` — badges on the component title and in navigation, Beta/Deprecated callouts on the page, and deprecated components sorted to the bottom of their nav category.

**Architecture:** One data-adapter module reads the status registry from `@mittwald/flow-react-components/internal` (the single seam, fail-silent) and exposes pure presentation mappers. Two dumb presentational components (`ComponentStatusBadge`, `ComponentStatusCallout`) render Flow `Badge`/`Alert` from those mappers. They are wired into `TopContent` (title + callout) and `MainNavigation` (nav badge + deprecated sort).

**Tech Stack:** Next.js (App Router), React 19, TypeScript, `@mittwald/flow-react-components` (`Badge`, `Alert`, `Heading`, `Content`), nx, pnpm.

## Global Constraints

- Branch off `main` (the status registry merged via #2729 is on `main`).
- Node `>=24`; use **bare `pnpm nx …`** for graph targets (`dev`, `build`) — never `corepack pnpm nx` (nested-spawn footgun). `corepack pnpm --filter` is only for single-package scripts.
- Read status **only** via `@mittwald/flow-react-components/internal`; never re-derive from JSDoc; always **fail-silent** (unknown name → no badge/callout, never a wrong one).
- Look up the **main `.` export surface** — `getFlowComponentStatus(name)` with the default `entry`. Docs component pages document that surface; `frontmatter.component` is the plain PascalCase display name.
- Compose **Flow components only** — no ad-hoc CSS, `className`, or raw `div`s. Text inside `Alert` goes through `Content` (Flow normalizes raw strings to `Text`).
- User-facing copy is **German**; code, comments, commits, and this plan are **English**.
- **Never hand-edit generated files.** `packages/components/src/status/component-status.json` is generated. The only allowed edit is a *temporary local stub* for manual verification, reverted before any commit.
- Proactively add the **`run-visual-tests`** PR label (docs render change; verify-only).

## Registry API consumed (from `@mittwald/flow-react-components/internal`, on `main`)

```ts
interface FlowComponentStatus {
  level: "beta" | "stable" | "deprecated";
  isNew: boolean;
  deprecationNotice?: string; // migration text from component-level @deprecated
}
// keyed by "<import-specifier>#<exportName>", e.g. "@mittwald/flow-react-components#Button"
function getFlowComponentStatus(
  name: string,
  entry?: "." | "flr-universal" | "nextjs" | "react-hook-form" | "password-tools",
): FlowComponentStatus | undefined; // defaults entry to ".", fail-silent
```

## File Structure

- **Create** `apps/docs/src/lib/componentStatus/componentStatus.ts` — data adapter (the only `/internal` importer) + pure presentation mappers + German copy constants.
- **Create** `apps/docs/src/lib/componentStatus/ComponentStatusBadge.tsx` — renders 0–2 `Badge`s.
- **Create** `apps/docs/src/lib/componentStatus/ComponentStatusCallout.tsx` — renders 0–1 `Alert`.
- **Create** `apps/docs/src/lib/componentStatus/index.ts` — barrel.
- **Modify** `apps/docs/src/app/_components/layout/TopContent/TopContent.tsx` — title badge + callout.
- **Modify** `apps/docs/src/app/_components/layout/MainNavigation/MainNavigation.tsx` — nav badge + deprecated-to-bottom sort.

---

### Task 1: Data adapter + presentation mappers

**Files:**
- Create: `apps/docs/src/lib/componentStatus/componentStatus.ts`

**Interfaces:**
- Consumes: `getFlowComponentStatus`, `FlowComponentStatus` from `@mittwald/flow-react-components/internal`.
- Produces:
  - `getComponentStatusInfo(name: string): FlowComponentStatus | undefined`
  - `getStatusBadges(status: FlowComponentStatus | undefined): StatusBadgeDescriptor[]` where `StatusBadgeDescriptor = { label: string; color: "violet" | "green" | "orange" }`
  - `getStatusCallout(status: FlowComponentStatus | undefined): StatusCalloutDescriptor | undefined` where `StatusCalloutDescriptor = { status: "info" | "warning"; heading: string; body: string }`
  - re-exports the `FlowComponentStatus` type

- [ ] **Step 1: Seed the dependency build (one-time), so `/internal` types resolve**

Branch off `main` first, then build the components package once so `apps/docs` typechecks can resolve `@mittwald/flow-react-components/internal`:

```bash
git checkout main && git pull
git checkout -b feat/docs-component-status
pnpm install
pnpm nx build components
```

Expected: build succeeds; `packages/components/dist/js/internal.mjs` and `dist/types/index/internal.d.ts` exist.

- [ ] **Step 2: Write the module**

Create `apps/docs/src/lib/componentStatus/componentStatus.ts`:

```ts
import {
  getFlowComponentStatus,
  type FlowComponentStatus,
} from "@mittwald/flow-react-components/internal";

export type { FlowComponentStatus };

/**
 * The single seam through which the docs app reads component lifecycle status.
 * Looks up the main "." export surface and fails silently (unknown name ->
 * undefined) so a missing entry never renders a wrong badge.
 */
export const getComponentStatusInfo = (
  name: string,
): FlowComponentStatus | undefined => getFlowComponentStatus(name);

export interface StatusBadgeDescriptor {
  label: string;
  color: "violet" | "green" | "orange";
}

/**
 * Badges to render for a status. `level` and `isNew` are orthogonal, so a
 * beta-and-new component yields two badges. `stable` contributes no level badge.
 */
export const getStatusBadges = (
  status: FlowComponentStatus | undefined,
): StatusBadgeDescriptor[] => {
  if (!status) {
    return [];
  }

  const badges: StatusBadgeDescriptor[] = [];

  if (status.level === "beta") {
    badges.push({ label: "Beta", color: "violet" });
  }
  if (status.level === "deprecated") {
    badges.push({ label: "Veraltet", color: "orange" });
  }
  if (status.isNew) {
    badges.push({ label: "Neu", color: "green" });
  }

  return badges;
};

export interface StatusCalloutDescriptor {
  status: "info" | "warning";
  heading: string;
  body: string;
}

const BETA_CALLOUT_BODY =
  "Diese Komponente befindet sich in der Beta-Phase. Ihre API ist von der " +
  "Stabilitätsgarantie ausgenommen und kann sich auch in Minor- oder " +
  "Patch-Releases noch ändern.";

const DEPRECATED_CALLOUT_FALLBACK =
  "Diese Komponente ist veraltet und wird in einer zukünftigen Version entfernt.";

/**
 * The single callout to render for a status, or undefined. Levels are mutually
 * exclusive, so at most one callout applies; `new` has no callout.
 */
export const getStatusCallout = (
  status: FlowComponentStatus | undefined,
): StatusCalloutDescriptor | undefined => {
  if (!status) {
    return undefined;
  }

  if (status.level === "beta") {
    return { status: "info", heading: "Beta", body: BETA_CALLOUT_BODY };
  }
  if (status.level === "deprecated") {
    return {
      status: "warning",
      heading: "Veraltet",
      body: status.deprecationNotice ?? DEPRECATED_CALLOUT_FALLBACK,
    };
  }

  return undefined;
};
```

- [ ] **Step 3: Typecheck**

Run:

```bash
pnpm exec tsc --noEmit -p apps/docs/tsconfig.json
```

Expected: no errors. (If `/internal` fails to resolve, re-run Step 1's `pnpm nx build components`.)

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/lib/componentStatus/componentStatus.ts
git commit -m "feat(docs): add component-status data adapter and presentation mappers"
```

---

### Task 2: Presentational components

**Files:**
- Create: `apps/docs/src/lib/componentStatus/ComponentStatusBadge.tsx`
- Create: `apps/docs/src/lib/componentStatus/ComponentStatusCallout.tsx`
- Create: `apps/docs/src/lib/componentStatus/index.ts`

**Interfaces:**
- Consumes: `getComponentStatusInfo`, `getStatusBadges`, `getStatusCallout` from `./componentStatus`; `Badge`, `Alert`, `Heading`, `Content` from `@mittwald/flow-react-components`.
- Produces:
  - `ComponentStatusBadge` (default + named), props `{ name: string }`
  - `ComponentStatusCallout` (default + named), props `{ name: string }`
  - barrel `index.ts` re-exporting both

- [ ] **Step 1: Write `ComponentStatusBadge.tsx`**

```tsx
import type { FC } from "react";
import { Badge } from "@mittwald/flow-react-components";
import {
  getComponentStatusInfo,
  getStatusBadges,
} from "@/lib/componentStatus/componentStatus";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
}

export const ComponentStatusBadge: FC<Props> = (props) => {
  const badges = getStatusBadges(getComponentStatusInfo(props.name));

  if (badges.length === 0) {
    return null;
  }

  return (
    <>
      {badges.map((badge) => (
        <Badge key={badge.label} color={badge.color}>
          {badge.label}
        </Badge>
      ))}
    </>
  );
};

export default ComponentStatusBadge;
```

- [ ] **Step 2: Write `ComponentStatusCallout.tsx`**

```tsx
import type { FC } from "react";
import { Alert, Content, Heading } from "@mittwald/flow-react-components";
import {
  getComponentStatusInfo,
  getStatusCallout,
} from "@/lib/componentStatus/componentStatus";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
}

export const ComponentStatusCallout: FC<Props> = (props) => {
  const callout = getStatusCallout(getComponentStatusInfo(props.name));

  if (!callout) {
    return null;
  }

  return (
    <Alert status={callout.status}>
      <Heading>{callout.heading}</Heading>
      <Content>{callout.body}</Content>
    </Alert>
  );
};

export default ComponentStatusCallout;
```

- [ ] **Step 3: Write the barrel `index.ts`**

```ts
export { ComponentStatusBadge } from "./ComponentStatusBadge";
export { ComponentStatusCallout } from "./ComponentStatusCallout";
export {
  getComponentStatusInfo,
  getStatusBadges,
  getStatusCallout,
  type FlowComponentStatus,
} from "./componentStatus";
```

- [ ] **Step 4: Typecheck**

Run:

```bash
pnpm exec tsc --noEmit -p apps/docs/tsconfig.json
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/lib/componentStatus/
git commit -m "feat(docs): add ComponentStatusBadge and ComponentStatusCallout"
```

---

### Task 3: Wire title badge + callout into `TopContent`

**Files:**
- Modify: `apps/docs/src/app/_components/layout/TopContent/TopContent.tsx`

**Interfaces:**
- Consumes: `ComponentStatusBadge`, `ComponentStatusCallout` from `@/lib/componentStatus`.

The component-page branch of `TopContent` currently reads:

```tsx
  return (
    <LayoutCard className={styles.topContent}>
      <ColumnLayout l={[1, 1]} m={[1]}>
        <Section>
          <Heading level={1}>{mdxFile.getTitle()}</Heading>

          {mdxFile.mdxSource.frontmatter.description}

          <Link href={mdxFile.getGitHubUrl()}>
            GitHub
            <IconExternalLink />
          </Link>
          {markdownLink}
        </Section>

        <MdxFileView mdxFile={mdxFile.serialize()} />
      </ColumnLayout>
    </LayoutCard>
  );
```

- [ ] **Step 1: Add the import**

At the top of the file, add:

```tsx
import {
  ComponentStatusBadge,
  ComponentStatusCallout,
} from "@/lib/componentStatus";
```

- [ ] **Step 2: Render badge under the H1 and callout under the description**

Replace the `<Section>` block shown above with:

```tsx
        <Section>
          <Heading level={1}>{mdxFile.getTitle()}</Heading>
          <ComponentStatusBadge name={component} />

          {mdxFile.mdxSource.frontmatter.description}
          <ComponentStatusCallout name={component} />

          <Link href={mdxFile.getGitHubUrl()}>
            GitHub
            <IconExternalLink />
          </Link>
          {markdownLink}
        </Section>
```

(`component` is the existing `const component = mdxFile.mdxSource.frontmatter.component;`; this branch only runs when it is defined.)

- [ ] **Step 3: Typecheck**

Run:

```bash
pnpm exec tsc --noEmit -p apps/docs/tsconfig.json
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/app/_components/layout/TopContent/TopContent.tsx
git commit -m "feat(docs): show status badge and callout on component page title"
```

---

### Task 4: Wire nav badge + deprecated-to-bottom sort into `MainNavigation`

**Files:**
- Modify: `apps/docs/src/app/_components/layout/MainNavigation/MainNavigation.tsx`

**Interfaces:**
- Consumes: `ComponentStatusBadge`, `getComponentStatusInfo` from `@/lib/componentStatus`.

- [ ] **Step 1: Add imports**

At the top of the file, add:

```tsx
import {
  ComponentStatusBadge,
  getComponentStatusInfo,
} from "@/lib/componentStatus";
```

- [ ] **Step 2: Render the badge inside the nav link**

In `NavigationLink`, replace the returned `<Link>`:

```tsx
  const component = treeItem.mdxSource.frontmatter.component;

  return (
    <Link
      href={`${pathname}${isComponent ? "/overview" : ""}`}
      aria-current={pathname === currentPage ? "page" : undefined}
    >
      {treeItem.getNavTitle()}
      {component && <ComponentStatusBadge name={component} />}
    </Link>
  );
```

(Add the `const component = …` line just before the existing `return`, alongside the other `const`s in `NavigationLink`.)

- [ ] **Step 3: Add a stable deprecated-last sort helper**

Above the `NavigationSection` component, add a module-level helper. It ranks a tree entry `1` when it is a `deprecated` component leaf, else `0`; `Array.prototype.sort` is stable, so equal ranks keep their original order:

```tsx
const deprecatedRank = (treeItem: MdxDirectoryTree | MdxFile): number => {
  if (!(treeItem instanceof MdxFile)) {
    return 0;
  }
  const component = treeItem.mdxSource.frontmatter.component;
  const status = component ? getComponentStatusInfo(component) : undefined;
  return status?.level === "deprecated" ? 1 : 0;
};

const sortEntriesByStatus = (
  entries: Array<[string, MdxDirectoryTree | MdxFile]>,
): Array<[string, MdxDirectoryTree | MdxFile]> =>
  [...entries].sort(([, a], [, b]) => deprecatedRank(a) - deprecatedRank(b));
```

- [ ] **Step 4: Apply the sort in the `NavigationSection` map**

In `NavigationSection`, replace `Object.entries(tree).map(...)` with `sortEntriesByStatus(Object.entries(tree)).map(...)`:

```tsx
      {sortEntriesByStatus(Object.entries(tree)).map(([group, treeItem]) =>
        treeItem instanceof MdxFile ? (
          <NavigationLink key={group} treeItem={treeItem} />
        ) : (
          <NavigationSection key={group} tree={treeItem} group={group} />
        ),
      )}
```

- [ ] **Step 5: Apply the sort in the top-level `MainNavigation` map**

In `MainNavigation`, replace `Object.entries(selectedMainBranch).map(...)` with the sorted variant:

```tsx
            {sortEntriesByStatus(Object.entries(selectedMainBranch)).map(
              ([group, treeItem]) =>
                treeItem instanceof MdxFile ? (
                  <NavigationLink key={treeItem.pathname} treeItem={treeItem} />
                ) : (
                  <NavigationSection key={group} tree={treeItem} group={group} />
                ),
            )}
```

- [ ] **Step 6: Typecheck**

Run:

```bash
pnpm exec tsc --noEmit -p apps/docs/tsconfig.json
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/app/_components/layout/MainNavigation/MainNavigation.tsx
git commit -m "feat(docs): badge components in nav and sort deprecated to bottom"
```

---

### Task 5: Integration verification with a temporary stub

No component is `beta`/`new` today, and the only `deprecated` entries (`nextjs#Link`, `nextjs#LinkProvider`) have no docs page — so real data shows nothing. Verify every path by temporarily stubbing the registry, then reverting.

**Files:**
- Temporarily modify (revert before finishing): `packages/components/src/status/component-status.json`

- [ ] **Step 1: Stub three states on the main surface**

Edit `packages/components/src/status/component-status.json` and change three real, documented components. Set `Button` to beta+new, `Badge` to deprecated with a notice, and leave a third (`Card`) stable as a control:

```jsonc
  "@mittwald/flow-react-components#Button": { "level": "beta", "isNew": true },
  "@mittwald/flow-react-components#Badge": { "level": "deprecated", "isNew": false, "deprecationNotice": "Verwende stattdessen die neue Status-Komponente." },
```

(Keep valid JSON — no comments in the actual file. Match the exact existing keys.)

- [ ] **Step 2: Rebuild the package and start the docs dev server**

```bash
pnpm nx build components
pnpm nx dev docs
```

Expected: dev server on `:3000` (or the configured port). Rebuilding `components` picks up the stubbed JSON.

- [ ] **Step 3: Eyeball every rendered effect**

Confirm in the browser:
- **Button** page (Actions): title shows a violet **Beta** badge **and** a green **Neu** badge; an info **Alert** headed "Beta" with the exemption text sits under the description; the sidebar link shows both badges.
- **Badge** page: title shows an orange **Veraltet** badge; a warning **Alert** headed "Veraltet" shows "Verwende stattdessen die neue Status-Komponente."; in the sidebar, **Badge** is sorted to the bottom of its category.
- **Card** page (control): no badge, no callout.
- Any component **not** in the registry / a non-component page: no badge, no callout (fail-silent), nav order unchanged.

- [ ] **Step 4: Revert the stub**

```bash
git checkout packages/components/src/status/component-status.json
pnpm nx build components
```

Expected: `git status` shows no change to the generated JSON.

- [ ] **Step 5: Authoritative build (typecheck + Next build)**

```bash
pnpm nx build docs
```

Expected: build succeeds with no type errors.

- [ ] **Step 6: Final commit / PR prep**

Ensure only the intended files changed (`git status` clean apart from the new lib + the two wired files). Open the PR and add the **`run-visual-tests`** label (docs render change; verify-only). Reference ADR 0003 §5 and the spec in the PR body.

```bash
git status
git push -u origin feat/docs-component-status
```

---

## Self-Review

**Spec coverage:**
- Title badge → Task 3. ✔
- Nav badge → Task 4 (Steps 1–2). ✔
- Beta + Deprecated callouts → Tasks 1–2 (`getStatusCallout` + `ComponentStatusCallout`), wired in Task 3. ✔
- Nav deprecated-to-bottom ordering → Task 4 (Steps 3–5). ✔
- Single seam / read via `/internal` / fail-silent → Task 1. ✔
- `deprecationNotice` from registry (no doc-properties) → Task 1 (`getStatusCallout`). ✔
- Two-badge Beta+Neu case → Task 1 (`getStatusBadges`). ✔
- German copy → Task 1 constants + labels. ✔
- Main `.` surface lookup → Task 1 (`getComponentStatusInfo`). ✔
- Testing = typecheck + manual/visual + label (no unit tests, per decision) → Steps throughout + Task 5. ✔
- Explainer page / Storybook decorator = out of scope. ✔ (not planned)

**Placeholder scan:** No TBD/TODO; every code step shows full content; commands have expected output.

**Type consistency:** `getComponentStatusInfo` / `getStatusBadges` / `getStatusCallout` and `StatusBadgeDescriptor` (`{label, color}`) / `StatusCalloutDescriptor` (`{status, heading, body}`) are named identically across Task 1 → Tasks 2–4. Badge `color` values (`violet`/`green`/`orange`) and Alert `status` values (`info`/`warning`) are assignable to the Flow `Badge`/`Alert` prop unions. `MdxDirectoryTree` and `MdxFile` are the existing imports already present in `MainNavigation.tsx`.
