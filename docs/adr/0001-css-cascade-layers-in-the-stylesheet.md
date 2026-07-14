# ADR 0001 – CSS Cascade Layers in the generated stylesheet

- **Status:** Accepted
- **Date:** 2026-07-07
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `@mittwald/flow-react-components` (`./all.css`), `@mittwald/flow-stylesheet`

## Context and problem statement

> The underlying build architecture is documented in
> [ADR 0002 (Stylesheet generation)](./0002-stylesheet-generation.md).

Flow ships its CSS as one bundled stylesheet. Components are authored in ~114
`*.module.scss` files (CSS Modules + Sass) and bundled by Vite/Rollup into a single
artifact (`dist/css/all.css`), which `@mittwald/flow-stylesheet` re-exports
unchanged. The foundation layer (design tokens as CSS custom properties,
`@font-face`, and a global reset with `all: initial` in `globals.scss`) comes from
`src/styles/index.scss` as a separate build branch.

Today Flow uses **no** CSS cascade layers (`@layer`). Which rule wins is decided
solely by **specificity + source order**. Flow relies on a prefix naming scheme
(`.flow--*`) that produces a relatively high but not controllable specificity.

That leads to two recurring problems:

1. **Consumer overrides are painful.** Adjusting a Flow component requires beating
   Flow's specificity (nested selectors, `!important`). This is fragile and breaks
   on internal Flow changes.
2. **No deterministic layer separation.** Foundation (tokens/reset) and components
   compete in the same flat cascade space. There is no language-guaranteed
   precedence.

React Aria Components ship **no CSS of their own** — Flow styles their
data-/class-hooks itself. So there is no third-party CSS conflict to account for
from that direction.

## Decision drivers

- **Overridability without a specificity fight** for consumers.
- **Deterministic, language-guaranteed layer ordering** within Flow (tokens before
  reset before components).
- **Minimal invasiveness** in the ~114 SCSS sources.
- **Interop** with consumer setups, especially Tailwind v4 (which uses `@layer`
  itself).
- **Browser support** must fit Flow's support matrix.

## Options considered

### Option A — Status quo (no layers)

No change. Cascade stays specificity + order based.

- ➕ No effort, no breakage.
- ➖ Solves neither problem. Override pain remains.

### Option B — A single layer `@layer flow`

Wrap the entire bundled CSS in one layer.

- ➕ Simplest contract; consumer overrides become trivial.
- ➕ Doable post-build in one step.
- ➖ No internal layer separation; foundation and components stay in the same layer.

### Option C — Nested sublayers `@layer flow.tokens, flow.reset, flow.base, flow.components` *(chosen)*

A top-level `flow` layer with a defined sub-order.

- ➕ Consumer overrides trivial (like B).
- ➕ Deterministic internal order: tokens → base/reset → components.
- ➕ Consumers can intervene between levels when needed.
- ➖ Slightly more build logic; the sub-boundaries must be derived from the existing
  foundation/component split.

## Decision

Flow wraps its generated stylesheet in **nested CSS cascade layers** under a
top-level `flow` layer:

```css
@layer flow.tokens, flow.reset, flow.base, flow.components;
```

- **`flow.tokens`** — design-token declarations (CSS custom properties).
  **Deliberately layered too**, so consumers can override tokens without
  specificity tricks.
- **`flow.reset`** — the global reset from `globals.scss` (`all: initial`,
  `prefers-reduced-motion`, `display` reverts, base typography defaults,
  `color-scheme`). Its own lowest style layer, so the reset unintentionally
  overrides neither components nor consumer styles.
- **`flow.base`** — `@font-face` (from `fonts.scss`) and future global base styles.
- **`flow.components`** — all component module styles.

The order is deliberate: reset at the bottom (only value tokens before it), then
base, then components. Since `globals.scss` already contains exclusively reset
rules (fonts live separately in `fonts.scss`), `flow.reset` can be assigned the
file as a whole — no cut within a file needed.

Further decisions:

- **Flow-owned layers only.** Flow declares and documents **no** layer order
  relative to consumer layers (e.g. Tailwind). Consumers position their own layers
  themselves. Flow only guarantees that its CSS lives entirely under `flow.*`.
- **In-place implementation at the source.** The ~114 `*.module.scss` stay
  untouched. The sublayers are assigned at their respective source (token build,
  `index.scss`, PostCSS plugin for components) and an order declaration is hoisted
  to the top of the merged `all.css` — no separate files, no assembly step. See
  "Implementation".
- **Rollout as a hard breaking change** for the default `all.css` in the next alpha
  release; additionally an **unlayered opt-out variant** as a separate export (see
  "Rollout & migration").

## Consequences

### Positive

- Consumers override any Flow rule with **unlayered** CSS — regardless of
  specificity, without `!important`.
- Flow's internal cascade is language-guaranteed: components beat the base, the
  base beats tokens — no matter how Rollup concatenates the files.
- Future-proof for more granular consumer control without pinning down a consumer
  contract today.

### Negative / risks

- **Behavior break on overrides.** Layered CSS generally loses against unlayered.
  Consumers who relied on Flow *overriding* their global styles/resets get
  regressions. Example: a global, unlayered `button { background: red }` previously
  lost against `.flow--button` and now wins.
- **Reset interaction.** The `all: initial` reset lives in the lowest style layer
  `flow.reset` and therefore loses against unlayered consumer resets as well as
  against all other Flow layers. This is consistent with the model but must be
  called out explicitly in the migration. Positive side effect: today's necessary
  fine-tuning of reset specificity (consistently 0-0-2 via `:where()`) becomes less
  critical, since components already beat the reset via layer order.
- **Browser support.** `@layer` is supported from Chrome/Edge 99, Firefox 97,
  Safari 15.4 (all ~Q1 2022, global >96%). In browsers without support the entire
  `@layer` rule is **ignored** — Flow's CSS would not apply there *at all*. Flow
  maintains **no** official browser-support matrix; the `@layer` baseline (~Q1 2022)
  is therefore the de-facto floor. This is deemed acceptable, since all relevant
  evergreen browsers have supported the feature for years.
- **Tooling.** Minifiers/bundlers must preserve `@layer`. esbuild (current
  `cssMinify`) and Lightning CSS do; verify before release.

## Rollout & migration

Since Flow is explicitly in `0.2.x-alpha` **without stability guarantees**, the
**default stylesheet is switched hard**: `all.css` is layered going forward. As an
**opt-out**, an **unlayered variant** is additionally shipped (see "Unlayered
variant" below) — so the switch is not forced, without diluting the layered default
variant.

- Layering becomes **active by default** for `all.css` in the next alpha bump; the
  existing `all.css` is replaced directly by the layered variant.
- Entry in `packages/components/MIGRATION.md` with:
  - Explanation of the new model (unlayered beats `flow.*`).
  - "Before/after" for the most common case (overriding gets *easier* — no more
    `!important`).
  - Warning for the regression case (global element styles/resets now win against
    Flow). **Extreme case:** an app-wide, unlayered `* { all: initial }` now
    overrides *all* Flow styles and leaves components unstyled. Recommendation: put
    your own reset in a layer *before* `flow` — or use the unlayered variant.

### Unlayered variant

For consumers who cannot (yet) adopt cascade layers, or whose app ships an
aggressive, unlayered reset (`* { all: initial }`), an additional **unlayered**
version is exported:

- `@mittwald/flow-react-components/all.unlayered.css`
- `@mittwald/flow-stylesheet/css-unlayered`

It is derived from the layered `all.css` by stripping the `@layer` wrappers (the
relative rule order is preserved). This restores the old, specificity-based
behavior: Flow's `.flow--*` selectors win over generic app selectors. The default
export (`all.css` / `css`) stays layered.

## Implementation

> **Verified via a local build** (see
> [ADR 0002](./0002-stylesheet-generation.md)): the release build produces **a
> single** `all.css` with tokens, fonts, reset and components. There are no separate
> foundation/component assets.

The sublayers are assigned **in place at their respective source** — no emit of
separate `flow-*.css` files, no assembly step. The merged `all.css` contains the
`@layer` blocks distributed throughout; a leading order declaration fixes the
priority, independent of the physical position of the blocks. The ~114
`*.module.scss` stay untouched. Implemented and verified via
`corepack pnpm --filter @mittwald/flow-react-components build`:

1. **`flow.tokens` — token build (Style Dictionary).**
   `packages/design-tokens/build-tokens.js` generates the token CSS across **7
   destinations** (`base`, `colors-light`, `colors-dark`, the `*-system` variants,
   `all-light/-dark`), each with its own `:root` selector. A custom registered
   format `css/variables-layered` wraps the `css/variables` output in
   `@layer flow.tokens { … }` (respecting `selector` + `outputReferences`). Since
   these files flow into `index.scss` via `@forward`, the layer travels into
   `all.css`; the `:root[data-theme=…]` and `prefers-color-scheme` selectors are
   preserved inside the layer.

2. **`flow.reset` / `flow.base` — `index.scss`.**
   `packages/components/src/styles/index.scss` assigns reset and fonts via
   `@layer flow.reset { @include meta.load-css("./globals"); }` and
   `@layer flow.base { @include meta.load-css("./fonts"); }` respectively, and
   declares the order `@layer flow.tokens, flow.reset, flow.base, flow.components;`.

3. **`flow.components` — PostCSS plugin.**
   `packages/components/dev/vite/flowComponentsLayerPlugin.ts` wraps every
   `*.module.(scss|css)` under `/src/components/` in `@layer flow.components` during
   CSS processing. Vite's CSS-modules scoping pipeline stays untouched, since only
   the parsed root is wrapped (`.module.css` **and** `.module.scss` are covered).

4. **Order declaration — Vite `writeBundle`.**
   esbuild (`cssMinify`) drops the declaration originating from `index.scss`;
   `packages/components/dev/vite/layerOrderPlugin.ts` hoists it to the top of
   `all.css` (after an optional `@charset`) after minification and removes
   duplicates.

**Deliberate consequence (in-place instead of separate files):** Since `all.css`
stays a merged artifact, tokens cannot easily be shipped separately at the document
level — this complicates Shadow-DOM encapsulation (tokens on the document `:root`,
components in the shadow root, because `:root` does not match inside the shadow
tree). If this use case becomes relevant, the file-per-layer approach should be
reconsidered.

**Open technical point:** The `writeBundle` rewrite shifts byte offsets after
minification → the `all.css.map` is then slightly inaccurate; follow up for
production.

## Resolved points

All originally open points are decided:

1. **Browser support:** There is no official support matrix. The `@layer` baseline
   (~Q1 2022) is the accepted floor.
2. **Artifact reality:** Confirmed via a local build — `all.css` stays a single,
   merged bundle (see "Implementation" /
   [ADR 0002](./0002-stylesheet-generation.md)). The sublayers are therefore
   assigned **in place at the source** (no separate file emit, no assembly).
3. **Escape hatch:** The default `all.css` is switched hard to layered; additionally
   an **unlayered variant** is shipped as an opt-out export (`./all.unlayered.css`
   and `./css-unlayered`) — among others for apps with an aggressive
   `* { all: initial }` reset (see "Rollout & migration").
4. **`flow.tokens`:** Token declarations are layered (consumers can override tokens
   without specificity tricks).

## Implementation status

A spike implements the layers and is verified via
`corepack pnpm --filter @mittwald/flow-react-components build` (the built `all.css`
begins with the order declaration, all four sublayers correctly populated,
including the three `*.module.css` components). Implemented in:

- `packages/design-tokens/build-tokens.js` – Style Dictionary format
  `css/variables-layered` wraps the token CSS in `@layer flow.tokens`.
- `packages/components/src/styles/index.scss` – reset in `@layer flow.reset`, fonts
  in `@layer flow.base`, order declaration.
- `packages/components/dev/vite/flowComponentsLayerPlugin.ts` – PostCSS plugin that
  wraps every `*.module.(scss|css)` in `@layer flow.components`.
- `packages/components/dev/vite/layerOrderPlugin.ts` – Vite `writeBundle` plugin
  that hoists the order declaration to the top of `all.css` after minification
  (esbuild drops it otherwise).

The **in-place approach** (per-module wrap + order hoist in a merged `all.css`) is
the decided implementation; the "Implementation" section describes it. The
file-per-layer variant is rejected (kept only as an option for a later Shadow-DOM
use case, see "Implementation").

## Next steps

- Sourcemap accuracy: the `writeBundle` rewrite shifts offsets in `all.css.map` –
  follow up for production.
- Full-pipeline run in CI (`corepack pnpm nx build components` with a complete
  workspace/codegen).
- Cosmetic: the 117 individual `@layer flow.components` blocks could be merged into
  one.
- `packages/components/MIGRATION.md` added; finalize the version heading at release.
