# ADR 0005 – Semver contract at 1.0.0

- **Status:** Accepted
- **Date:** 2026-07-29
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** every published `@mittwald/flow-*` package, `public.ts` and the
  `flr-universal` surface, the `engines.node` floor and `react` peer ranges,
  `apps/docs`, and a future contract CI guard (see
  [RFC #2711](https://github.com/mittwald/flow/issues/2711))

> This ADR fixes **what the semver guarantee covers at 1.0.0** — which changes
> force a Major and which may ship in a Minor/Patch. The release *mechanics* that
> carry a breaking change (major line, forward-merge, promotion) are
> [ADR 0004](0004-forward-merge-main-into-next.md); the **per-component** switch
> on this contract is [ADR 0003](0003-component-lifecycle-status.md). The model
> itself is accepted in [RFC #2711](https://github.com/mittwald/flow/issues/2711).
> The Node/React portion below landed with
> [#2728](https://github.com/mittwald/flow/pull/2728); this ADR records it.

## Context

`1.0.0` turns Flow's implicit "we try not to break you" into a **public promise**
under semantic versioning. A promise is only useful if its boundary is explicit:
consumers must know exactly which surfaces are safe to depend on, and
maintainers must know which changes are allowed to ship in a Patch/Minor versus
which force the (deliberately rare) Major line.

Two failure modes to avoid:

1. **Over-promising.** Guaranteeing the TypeScript *type* surface, the rendered
   pixels, the DOM structure, the CSS class names, or the design-token values
   would make almost every routine change breaking — freezing the design system.
2. **Under-documenting.** If we quietly *don't* guarantee those things but never
   say so, consumers will couple to them anyway (styling internal classes,
   pinning to exact type shapes) and we break them *de facto* on a Patch.

Fixed versioning (one version across all `@mittwald/flow-*` packages, per
RFC #2711) means this one contract applies uniformly to every package.

## Decision

### 1. Under the guarantee (breaking → Major line)

- The **runtime public API** of `public.ts` — which components/exports exist and
  the props they accept *at runtime*, plus documented function behavior. The
  *type-level* surface is explicitly **excluded** (see §4).
- **`@flr-generate` / `flr-universal` props** — the contract with extension
  developers. The standing rule holds: *deprecate, don't break* (keep the old
  path, warn via `useWarnDeprecation`).
- **Published icon identities** — removing or renaming an icon is breaking. (Per
  the icon pipeline, icons are *never removed, only deprecated* — see ADR 0003
  §4.)
- **The remote protocol** — the versioned negotiation layer stays compatible as
  long as it can; when it genuinely cannot, that is a `feat!:` → Major.

### 2. Node engines floor (#2728)

- The **guaranteed floor is the actively supported Node LTS** — currently
  `node >=24`, declared **uniformly across all packages** (#2728). It is bumped
  **lazily**: only on concrete need, not to chase new releases.
- **Dropping a Node version still inside its LTS/maintenance window is breaking
  (→ Major).** Dropping an **already-EOL** version may ship in a **Minor**.
- **Node-entry packages are stricter.** `@mittwald/ext-bridge` and
  `@mittwald/flow-remote-core` expose a real Node runtime (a `node` export
  condition); for them **any** raise of the required Node floor is breaking
  (→ Major), regardless of EOL, and they may carry a **more conservative** floor
  than the build-only packages.

### 3. React peer range

React is a genuine runtime peer in every package.

- **Widening** the accepted range (e.g. `^19` → `^19 || ^20`) is **non-breaking**
  (Minor).
- **Raising the minimum**, or **dropping a React major**, is **breaking**
  (→ Major).

### 4. Explicitly NOT under the guarantee (change freely, at most Minor/Patch)

- **All type-level (TypeScript) changes.** The type surface is best-effort, not
  semver-protected. Even removing/renaming an exported type or narrowing a prop's
  accepted type is not, on its own, breaking. (Notable type changes are still
  called out in the changelog.)
- **Visual appearance.**
- **Internal DOM structure.**
- **CSS class names.**
- **Design-token names *and* values.**

### 5. Per-component override (ADR 0003)

The contract is not all-or-nothing. A component's **lifecycle status**
(ADR 0003), read from the generated `component-status.json` registry, overrides
the surface rules above:

- **`beta`** — exempt from the breaking-change promise; its API may change in a
  non-major release.
- **`stable`** (default) — fully bound by §1–§4.
- **`deprecated`** — under the guarantee until removed in a Major, and ships a
  migration path.

### 6. Public documentation obligations

Because §4 deliberately leaves surfaces unguaranteed, we **must state this
publicly**, or we break consumers de facto:

- Consumers **must not style against internal CSS classes** (they can change on
  any release).
- Consumers **must treat Flow's TypeScript types as best-effort** — pin exact
  versions if a `tsc` break on a Patch would hurt.

These two statements are a launch requirement for the 1.0.0 docs, not optional.

## Consequences

**Positive**

- A precise, published boundary: consumers know what to depend on, maintainers
  know what forces a Major. Breaking changes stay genuinely rare.
- The design system can keep evolving visuals, DOM, CSS, tokens, and types
  without ceremony — the surfaces that *should* be free to move are free.
- One uniform contract across all fixed-versioned packages; no per-package
  special-casing except the documented Node-entry strictness (§2).

**Negative / trade-offs**

- "Types are best-effort" will surprise consumers who expect TypeScript changes
  to follow semver; §6 documentation is essential to set that expectation.
- The Node/React rules are nuanced (EOL-coupling, stricter Node-entry packages,
  widen-vs-raise for peers) — easy to violate by hand, which is why the contract
  guard below matters.
- Excluding CSS class names and token names/values means consumers who coupled to
  them during the `0.x` line may need a one-time migration at 1.0.0.

## Follow-ups (not part of this ADR)

- **A CI guard for the version contract:** fail a PR that raises `engines.node`
  or narrows a `react` peer range without a breaking-change marker
  (`feat!:` / `BREAKING CHANGE`). This would have caught the `>=24` floor bump
  that shipped as a `fix` in #2728. Composes with the RFC #2711 routing guard.
  Not yet implemented.
- The **one-time API review** of the ~110 `public.ts` exports + `flr-universal`
  props before the cut (RFC #2711, "The 1.0.0 cut") — the last cheap chance to
  fix names/props/types before they go under this contract.
- Publish the §6 consumer-facing contract notes on the docs site.
