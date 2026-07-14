# ADR 0001 – CSS Cascade Layers in the generated stylesheet

- **Status:** Accepted
- **Date:** 2026-07-07
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `@mittwald/flow-react-components` (`./all.css`, `./all-layered.css`),
  `@mittwald/flow-stylesheet` (`./css`, `./css-layered`)

## Context and problem statement

> The underlying build architecture is documented in
> [ADR 0002 (Stylesheet generation)](./0002-stylesheet-generation.md).

Flow ships its CSS as one bundled stylesheet. Components are authored in ~114
`*.module.scss` files (CSS Modules + Sass) and bundled by Vite/Rollup into a single
artifact (`dist/css/all.css`), which `@mittwald/flow-stylesheet` re-exports. The
foundation layer (design tokens as CSS custom properties, `@font-face`, and a global
reset with `all: initial` in `globals.scss`) comes from `src/styles/index.scss`.

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
data-/class-hooks itself. So there is no third-party CSS conflict from that
direction.

## Decision drivers

- **Overridability without a specificity fight** for consumers who want it.
- **Deterministic, language-guaranteed layer ordering** within Flow (tokens before
  reset before components).
- **No forced breaking change** for existing consumers — cascade layers change how
  overrides resolve, so adopting them must be opt-in.
- **Minimal invasiveness** in the ~114 SCSS sources.
- **Interop** with consumer setups, especially Tailwind v4 (which uses `@layer`).
- **Browser support** must fit Flow's support matrix.

## Options considered

*Layer granularity:*

### Option A — Status quo (no layers)

- ➕ No effort, no breakage.
- ➖ Solves neither problem. Override pain remains.

### Option B — A single layer `@layer flow`

- ➕ Simplest contract; overrides become trivial.
- ➖ No internal layer separation.

### Option C — Nested sublayers `@layer flow.tokens, flow.reset, flow.base, flow.components` *(chosen for the layered variant)*

- ➕ Overrides trivial; deterministic internal order; consumers can intervene
  between levels.
- ➖ Slightly more build logic.

*Default behavior:*

Wrapping the **default** `all.css` in layers changes how existing consumers'
unlayered CSS resolves against Flow (unlayered then beats Flow regardless of
specificity — a runtime behavior change; the extreme case is an app-wide
`* { all: initial }` that would wipe layered Flow entirely). To avoid forcing that
on anyone, the layered stylesheet is shipped as an **opt-in variant** rather than
replacing the default.

## Decision

Flow ships **two** stylesheet variants:

- **`all.css` / `css` (default, unlayered)** — unchanged behavior. Cascade stays
  specificity + source order based, exactly as before. Adopting this release is
  **non-breaking**.
- **`all-layered.css` / `css-layered` (opt-in, layered)** — the same styles wrapped
  in nested CSS cascade layers under a top-level `flow` layer:

  ```css
  @layer flow.tokens, flow.reset, flow.base, flow.components;
  ```

  - **`flow.tokens`** — design-token declarations (CSS custom properties), layered
    so consumers can override tokens without specificity tricks.
  - **`flow.reset`** — the global reset from `globals.scss` (`all: initial`,
    `prefers-reduced-motion`, `display` reverts, base typography, `color-scheme`);
    its own lowest style layer.
  - **`flow.base`** — `@font-face` (from `fonts.scss`) and future global base
    styles.
  - **`flow.components`** — all component module styles.

Both variants come from the same build: the pipeline layers the CSS at the source,
which yields the layered variant directly; the default is that output with the
`@layer` wrappers stripped (see "Implementation").

Further decisions:

- **Flow-owned layers only.** The layered variant declares/documents no layer order
  relative to consumer layers (e.g. Tailwind). Consumers position their own layers
  themselves; Flow only guarantees its CSS lives entirely under `flow.*`.
- **Non-breaking rollout.** The default `all.css` keeps today's behavior; the
  layered variant is purely additive.

## Consequences

### Positive

- **Non-breaking:** existing consumers on `all.css` / `css` see no change.
- Consumers who opt into the layered variant override any Flow rule with
  **unlayered** CSS — regardless of specificity, without `!important` — and get a
  language-guaranteed internal order (components beat base beats tokens).
- Future-proof for more granular consumer control, without pinning down a consumer
  contract today.

### Negative / risks

- **Two artifacts to maintain and document.** Consumers must consciously choose the
  layered variant to gain the benefit.
- **Opt-in behavior semantics.** In the layered variant, layered CSS loses to
  unlayered CSS. A consumer adopting it whose unlayered global styles/resets used to
  lose against Flow will now see those win (extreme case: `* { all: initial }`
  wipes Flow). This is why it is opt-in; documented in the stylesheet docs.
- **Browser support (layered variant).** `@layer` is supported from Chrome/Edge 99,
  Firefox 97, Safari 15.4 (all ~Q1 2022, global >96%). In browsers without support
  the entire `@layer` rule is **ignored** — the layered variant would not apply
  there at all; those consumers should use the default `all.css`. Flow keeps no
  official browser-support matrix; the `@layer` baseline (~Q1 2022) is the de-facto
  floor for the layered variant.
- **Tooling.** Minifiers/bundlers must preserve `@layer`. esbuild (current
  `cssMinify`) does; verify before release.

## Rollout & migration

**Non-breaking.** The default `all.css` / `css` is unchanged; the layered variant is
an additional opt-in export. No consumer action is required to adopt the release.

- The stylesheet docs page documents both variants and when to pick the layered one.
- Consumers who want easy, specificity-free overriding (or full Tailwind-style layer
  interop) opt into `all-layered.css` / `css-layered`. When adopting it, an
  app-side unlayered reset that conflicts with Flow (e.g. `* { all: initial }`)
  should be moved into a layer declared before `flow`.

## Implementation

> **Verified via a local build** (see
> [ADR 0002](./0002-stylesheet-generation.md)): the release build produces **a
> single** CSS output containing tokens, fonts, reset and components. There are no
> separate foundation/component assets.

The pipeline assigns the sublayers **in place at their respective source**, which
produces the layered variant; the unlayered default is that output with `@layer`
stripped. The ~114 `*.module.scss` stay untouched. Implemented and verified via
`corepack pnpm --filter @mittwald/flow-react-components build`:

1. **`flow.tokens` — token build (Style Dictionary).**
   `packages/design-tokens/build-tokens.js` registers a custom format
   `css/variables-layered` that wraps the `css/variables` output (all 7
   destinations; `selector` + `outputReferences` preserved) in
   `@layer flow.tokens { … }`. Via `@forward` in `index.scss` the layer travels into
   the bundle; the `:root[data-theme=…]` / `prefers-color-scheme` selectors are
   preserved inside the layer.

2. **`flow.reset` / `flow.base` — `index.scss`.**
   `packages/components/src/styles/index.scss` assigns the reset via
   `@layer flow.reset { @include meta.load-css("./globals"); }` and fonts via
   `@layer flow.base { @include meta.load-css("./fonts"); }`, and declares the order.

3. **`flow.components` — PostCSS plugin.**
   `packages/components/dev/vite/flowComponentsLayerPlugin.ts` wraps every
   `*.module.(scss|css)` under `/src/components/` in `@layer flow.components`
   without disturbing Vite's CSS-modules scoping.

4. **Order declaration — Vite `writeBundle`.**
   esbuild (`cssMinify`) drops the declaration from `index.scss`;
   `packages/components/dev/vite/layerOrderPlugin.ts` hoists it to the top of the
   emitted `all.css` (after an optional `@charset`) and removes duplicates. This
   emitted file is the **layered** output.

5. **Variant split — Vite `writeBundle`.**
   `packages/components/dev/vite/stylesheetVariantsPlugin.ts` writes the layered
   output to `all-layered.css`, then strips all `@layer` wrappers (block-form
   `replaceWith(nodes)`, statement-form `remove`) and overwrites `all.css` with the
   unlayered result. `@mittwald/flow-stylesheet` copies both into `styles.css`
   (default) and `styles-layered.css`.

**Note (Shadow DOM):** since the layered variant is a single merged file, tokens
cannot easily be shipped separately at the document level, which complicates
Shadow-DOM encapsulation (tokens on the document `:root`, components in the shadow
root, because `:root` does not match inside the shadow tree). If that use case
becomes relevant, a file-per-layer approach should be reconsidered.

**Open technical point:** the `writeBundle` rewrite shifts byte offsets after
minification → the sourcemap is then slightly inaccurate; follow up for production.

## Resolved points

1. **Browser support:** No official support matrix; the `@layer` baseline (~Q1 2022)
   is the accepted floor for the layered variant. Older browsers use the default.
2. **Artifact reality:** Confirmed via a local build — the build yields a single
   merged output (see "Implementation" /
   [ADR 0002](./0002-stylesheet-generation.md)); the variants are produced by
   keeping vs. stripping `@layer`.
3. **Default vs. opt-in:** The default `all.css` / `css` stays **unlayered**
   (non-breaking); the layered variant is shipped as the opt-in
   `all-layered.css` / `css-layered`.
4. **`flow.tokens`:** Token declarations are layered in the layered variant
   (consumers can override tokens without specificity tricks).

## Implementation status

A spike implements the variants and is verified via
`corepack pnpm --filter @mittwald/flow-react-components build` and
`--filter @mittwald/flow-stylesheet build`. Implemented in:

- `packages/design-tokens/build-tokens.js` – `css/variables-layered` format.
- `packages/components/src/styles/index.scss` – reset/fonts layers + order.
- `packages/components/dev/vite/flowComponentsLayerPlugin.ts` – component wrap.
- `packages/components/dev/vite/layerOrderPlugin.ts` – order-declaration hoist.
- `packages/components/dev/vite/stylesheetVariantsPlugin.ts` – emits
  `all-layered.css` and strips `@layer` for the unlayered default `all.css`.
- exports: `@mittwald/flow-react-components` `./all-layered.css`,
  `@mittwald/flow-stylesheet` `./css-layered`.

## Next steps

- Sourcemap accuracy: the `writeBundle` rewrite shifts offsets; follow up for
  production.
- Full-pipeline run in CI (`corepack pnpm nx build components` with a complete
  workspace/codegen).
- Cosmetic: the many individual `@layer flow.components` blocks could be merged into
  one.
