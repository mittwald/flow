# ADR 0003 – Component lifecycle status

- **Status:** Proposed
- **Date:** 2026-07-27
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `@mittwald/flow-react-components`, `apps/docs`,
  Storybook, and a future breaking-change guard (see
  [RFC #2711](https://github.com/mittwald/flow/issues/2711))

> This ADR defines a **per-component lifecycle status** for Flow components.
> The status is an authored, per-component annotation. It does **not** affect
> the overall Flow package version — it is the per-component switch for the
> semver contract described in [RFC #2711](https://github.com/mittwald/flow/issues/2711).

## Context

Flow ships ~110 components as a single, fixed-version package. Today every
component is implicitly held to the same stability promise, which creates two
problems:

1. **No room to iterate.** A freshly shipped, still-hardening API (e.g. `Chat`,
   `CodeEditor`) is bound by the same no-breaking-changes promise as a
   battle-tested `Button`. Either we freeze immature APIs too early, or we break
   the promise.
2. **No machine-readable stability signal.** Consumers (extension developers)
   and tooling have no reliable way to know which components are safe to depend
   on, which are new, and which are on their way out.

We want a single authored source that drives everything downstream —
documentation, Storybook, and (later) a CI breaking-change guard — without
introducing a second place where "how stable is this component" is decided.

## Decision

### 1. Model

A per-component status made of two orthogonal parts:

- A **ladder** (mutually exclusive): `beta` → `stable` → `deprecated`.
- An orthogonal **`new` flag** that can accompany any ladder value.

The default — no annotation at all — is `stable`. Doing nothing is safe: no
existing component needs to be touched for the 1.0.0 launch.

`new` is set **and** removed by hand. There is no date and no auto-expiry.

### 2. Contract weight (the core decision)

The status is **not** merely a documentation badge. It is the per-component
switch for the semver contract from
[RFC #2711](https://github.com/mittwald/flow/issues/2711):

- `beta` = **exempt from the breaking-change promise**. A `beta` component may
  change its API in a non-major release.
- `stable` = bound by the breaking-change promise.
- `deprecated` = on its way out; may break as part of removal.

The generated status registry (see §4) is the **canonical, machine-readable
source of this contract**. A future breaking-change guard (its implementation
is deferred to RFC #2711) **must** read the registry and exclude `beta` (and, in
practice, `deprecated`) components from the breaking-change check. This ADR does
**not** build that guard; it fixes the intent and the registry shape so the
guard is not blocked later.

### 3. Authoring syntax (JSDoc, component-level)

Status is authored as component-level JSDoc, parsed by
`react-docgen-typescript` (which already captures component-level tags, e.g.
`@flr-generate`):

- `@flowStatus beta` — ladder value `beta`.
- `@flowStatus new` — the `new` flag.
- `@flowStatus beta, new` — combined, comma-separated tokens (matching the
  repo's existing multi-value tag convention, e.g. `@flr-slot-props a, b, c`).
- **`deprecated` is authored via the standard `@deprecated` tag**, not via
  `@flowStatus`. This gives IDE strikethrough, the TypeScript deprecation
  warning, and the migration text for free.

Omitting all of the above yields `stable`.

**Conflict rules:**

- If a component carries both `@flowStatus beta` and a component-level
  `@deprecated`, **`deprecated` wins** for the `level` — a component on its way
  out takes precedence over beta.
- `level: "deprecated"` is derived only from a **component-level** `@deprecated`.
  A `@deprecated` on an individual prop does **not** set the component status.

### 4. Single source of truth: the status registry

The rule "how do tags become a status" lives in **exactly one place** — the
generator. Everything downstream consumes the derived result.

- **Source:** `doc-properties.json` (the build-time output of
  `packages/components/dev/createDocPropertiesJson.ts`), which parses **all**
  components' component-level tags — not only the `@flr-generate` subset. Using
  the `@flr-generate` subset would miss non-remote components that are `beta` or
  `new`.
- **Generator step:** a dedicated nx target (proposed name
  `build:status-registry`) with `dependsOn: ["build:docs-properties"]`, wired
  into the `build` chain. Its outputs are committed, guarded by the existing CI
  "Check all generated code is committed" step (`git diff --exit-code`).
- **Artifacts** in `packages/components/src/status/`:
  - `component-status.json` — the canonical, **flat** map. Readable without a
    TypeScript toolchain (`git show <ref>:<path> | jq`), which is what a
    git-ref-comparing breaking-change guard needs.
  - `componentStatus.ts` — a thin, typed wrapper that imports the JSON
    (`resolveJsonModule` is enabled) and re-exports it with the
    `FlowComponentStatus` types. Serves runtime consumers with type safety.
- **Shape:** a **record** per component, keyed by component display name, e.g.
  `{ level: "beta" | "stable" | "deprecated", isNew: boolean }`. A scalar could
  not represent "beta **and** new".
- **Completeness:** the registry lists **all** components explicitly (including
  `stable`, `isNew: false`). This lets the guard distinguish "component removed"
  from "component is stable" — an ambiguity a sparse map (absence = stable)
  cannot express.
- **Export:** via `src/index/internal.ts` (i.e. the `/internal` package export).
  Consumers are documentation, Storybook, and tooling — not the public
  component API.
- **Scope — public surface, not icons.** The registry lists Flow's curated
  public components (the entries in `src/components/public.ts`). The generated
  icon components (`Icon*`) carry no JSDoc, are excluded from
  `doc-properties.json`, and are **not** tracked per icon — the `Icon` component
  represents them (`stable`). Icons are **never removed — only deprecated**, and
  that lifecycle is authored in `icons-base/src/icons.yaml` (`deprecated: true`),
  owned by the icon pipeline. Because there is no icon removal, a breaking-change
  guard has no per-icon "removed vs. stable" ambiguity to resolve, so per-icon
  registry entries would add no value.

### 5. Consumers

- **Documentation (`apps/docs`)** reads the registry via the `/internal` export.
  It does **not** re-derive status from tags — no second derivation, no drift.
  `doc-properties.json` remains the source for the prop tables; the **status**
  comes from the registry. Rendered effects:
  - Badge on the component title and in navigation / the component overview
    (Beta / New / Deprecated; `stable` renders no badge).
  - A **Beta callout** making the contract exemption visible.
  - A **Deprecated callout** carrying the migration text from `@deprecated`.
  - A filter / grouping in the overview (New grouped, Deprecated moved to the
    end / hideable).
- **Storybook** registers a **global decorator** in `preview.tsx` that imports
  the registry, resolves the component from `context.component` (falling back to
  the last segment of `context.title`), and renders the status via the Flow
  `Badge` component. It is **fail-silent**: when the component cannot be
  resolved, no badge is shown (never a wrong badge). No per-story boilerplate,
  no new dependency.
- **Component-usage reporting** is a **potential future** consumer (telemetry on
  which components — and which statuses — are used). It is out of scope for the
  initial implementation, but the registry shape must not preclude it (status is
  machine-readable per component type at runtime).

### 6. Runtime behavior

- The status system emits **no automatic runtime warnings** — including **no**
  beta warning.
- **Deprecation warnings stay manual.** Whether an entire component or a single
  prop is deprecated, the developer reports it in code via `useWarnDeprecation`
  with the correct migration message (the existing pattern, e.g.
  `Action.tsx`, `TextArea.tsx`). The registry does **not** drive these.
- `DeprecationWarningProvider` is untouched and knows nothing about the status
  system.

### 7. Rollout of existing components

- The default (`stable`) makes doing nothing safe.
- This ADR does **not** enumerate which existing components become `beta`. That
  is a curation decision for the 1.0.0 API review (tracked alongside RFC #2711).
- **Criteria for `beta`:** young API not yet hardened by real-world use; known
  open design questions; complex / experimental surface; likely breaking changes
  before stabilization.

## Consequences

**Positive**

- One authored source (JSDoc) drives docs, Storybook, and the future guard;
  derivation logic exists in exactly one place.
- Immature APIs can ship and iterate without breaking the stability promise for
  the rest of the library, and without a per-component version scheme.
- The contract becomes machine-enforceable once the guard lands, rather than a
  prose promise a reviewer has to remember.
- Zero migration cost at launch: unannotated components are `stable`.

**Negative / trade-offs**

- Two generated artifacts (JSON + TS wrapper) instead of one. Both are
  auto-generated and committed, so the maintenance cost is nil, but there is one
  more file under the `git diff --exit-code` gate.
- The Storybook badge relies on component auto-detection; stories that do not
  set `component:` cleanly get no badge (fail-silent).
- The breaking-change guard is only intent here, not enforcement. Until RFC
  #2711 delivers it, "beta = may break" is honored by humans at review time.

## Follow-ups (not part of this ADR)

- Implement the generator, nx wiring, and the two committed artifacts.
- Implement the docs and Storybook consumers.
- A user-facing documentation page explaining what Beta / New / Deprecated mean
  for extension developers (the contract exemption).
- The breaking-change guard and its registry-driven `beta`/`deprecated`
  exemption — see [RFC #2711](https://github.com/mittwald/flow/issues/2711).
