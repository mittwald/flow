# ADR 0002 – Stylesheet generation and CSS authoring

- **Status:** Accepted (documented retroactively)
- **Date:** 2026-07-07
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `@mittwald/flow-react-components`, `@mittwald/flow-stylesheet`,
  `@mittwald/flow-design-tokens`

> This ADR describes the **current state** of stylesheet generation. It was written
> retroactively to record the already-established architecture as a decision basis —
> among others as context for
> [ADR 0001 (CSS cascade layers)](./0001-css-cascade-layers-in-the-stylesheet.md).

## Context

Flow needs a shipped CSS artifact that consumers can include, plus an authoring
model that styles ~118 components maintainably. This ADR records which tools and
conventions are in use for that and how the final stylesheet comes about.

## Decision / architecture

### 1. Component authoring: CSS Modules + Sass

- Styles are authored per component in `*.module.scss` (~114 files; plus 3
  `*.module.css`).
- Class names are mapped to a `flow--*` prefix via a **custom scoped-name
  generator** (`packages/components/dev/vite/cssModuleClassNameGenerator.ts`),
  derived from the component path:
  - `components/Button` + class `.button` → `.flow--button`
  - `components/RadioGroup/components/Radio` → `.flow--radio-group--radio`
- Sass features (`@use`, `@forward`, `@mixin`) are in use; mixins live under
  `packages/components/src/styles/mixins/`.
- React Aria hooks are styled via `:global(.react-aria-*)` selectors (see e.g.
  `Calendar.module.scss`, `TimeField.module.scss`).

### 2. Foundation layer

`packages/components/src/styles/index.scss` bundles the global foundation in a
defined order:

1. Design tokens: `@forward "@mittwald/flow-design-tokens/css/base.css"`,
   `colors-light.css`, `colors-dark.css`
2. System-preference colors via `@media (prefers-color-scheme)` +
   `meta.load-css(...)`
3. `@forward "./fonts"` (`@font-face`)
4. `@forward "./globals"` (global reset, incl. `all: initial`)

### 3. Design tokens: Style Dictionary → CSS custom properties

- Package `@mittwald/flow-design-tokens`, built via Style Dictionary
  (`packages/design-tokens/build-tokens.js`).
- Source: YAML definitions (`color-palette.yml`, `size.yml`, `effects.yml`, …).
- Output: several theme-specific CSS files (`base.css`, `colors-light.css`,
  `colors-dark.css`, system variants, combined `all-*.css`).
- Custom transform `name/flow-css-var`: token `button.padding-y` →
  `--button--padding-y`. Tokens are therefore consistently **CSS custom
  properties**.

### 4. Bundling: Vite (Rollup) in library mode

Configuration: `packages/components/vite.build.config.ts` (+ base
`vite.config.ts`).

- Several lib entries (`default`, `internal`, `flr-universal`, integrations,
  `globals`), format `es`, `preserveModules: true`.
- CSS preprocessing via Sass; CSS-module scoping via the custom generator
  (`vite.config.ts`, `css.modules.generateScopedName`).
- CSS minification via **esbuild** (`cssMinify: "esbuild"`).
- Asset mapping in `rollupOptions.output.assetFileNames`:
  - `flow-react-components.css` → `dist/css/all.css`
  - `globals.css` → `dist/css/globals.css` *(mapping present, but currently not
    produced as a separate asset by the release build — see below)*
- **No** explicit PostCSS setup (no `postcss.config.*`). `postcss`,
  `postcss-nesting`, `postcss-nested-import` are in devDependencies; Sass is the
  primary preprocessor.

### 5. Delivery

- The release build produces **a single** CSS artifact: `dist/css/all.css`
  (~390 KB). It contains **everything** — component styles, token definitions
  (`:root`, incl. 756 `--color--*` declarations), `@font-face` and the
  `all: initial` reset. A separate `globals.css` is **not** produced by the release
  build.
- `@mittwald/flow-react-components` exports it as `./all.css` (`exports` in
  `package.json`).
- `@mittwald/flow-stylesheet` re-exports it unchanged: `build.js` copies
  `@mittwald/flow-react-components/all.css` to `dist/styles.css` and exports it as
  `./css`.

### 6. Cascade model (current state)

- **No** CSS cascade layers (`@layer`).
- Actual order in the built `all.css` (verified by byte offset):
  1. **Component module styles** (from byte 17)
  2. **Token `:root` definitions** (from ~byte 270k)
  3. **`@font-face` + global `all: initial` reset** (~byte 373k, at the end)

  So *components → tokens → fonts/reset* — not foundation-first. This works because
  CSS custom properties are resolved independently of source order.
- Precedence is therefore effectively decided by **specificity** (the `flow--*`
  prefix), **not** by source order. → This is the starting point for
  [ADR 0001](./0001-css-cascade-layers-in-the-stylesheet.md).

### 7. React Aria

`react-aria-components` (^1.19) provides only behavior/markup, **no CSS**, and is
externalized in the build (`externalizeDeps`). No third-party CSS therefore ends up
in the shipped bundle.

## Consequences

- **Maintainability:** Clear separation tokens ↔ foundation ↔ components; styles
  live next to their component. Scoped naming prevents collisions.
- **One artifact:** Consumers include a single CSS file — simple integration.
- **No layer precedence model:** Overrides depend on specificity (the motivation for
  ADR 0001).
- **Tooling dependency:** The build relies on Vite's Sass/CSS-module pipeline and a
  tailored asset renaming; changes there act directly on `all.css`.

## Verified via a local build

A local `npx nx build components` and inspection of `dist/css/` confirmed: **exactly
one** file, `all.css`, is produced, containing tokens, fonts, reset and components in
the order described above. The release build produces **no** separate foundation
asset. This is decisive for the implementation of
[ADR 0001](./0001-css-cascade-layers-in-the-stylesheet.md): since foundation and
components live in one merged file (foundation even partly *after* the components),
the sublayer structure **cannot** be achieved by wrapping separate assets.
