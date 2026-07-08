# AGENTS.md — @mittwald/flow-design-tokens

Package-specific notes. See the [root AGENTS.md](../../AGENTS.md) for
monorepo-wide commands and conventions.

## What this package is

Design tokens for the whole system, built with `style-dictionary` (v5) via a
single custom script: `pnpm build` runs `node build-tokens.js` (uses
`js-yaml`/`fs-jetpack` to read source tokens and emit built artifacts).

Source tokens live under `src/` (e.g. `src/dataVisualisation` for chart
color tokens).

## Consumption

- Publishes **only** built artifacts — `./css/*` → `dist/css/*` and
  `./json/*` → `dist/json/*`. There is no JS/TS API to import.
- Consumed by `components` (devDependency) and `apps/docs` (dependency) for
  shared CSS/token values.
- No test scripts are defined on this package.
