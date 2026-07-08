# AGENTS.md — @mittwald/flow-core

Package-specific notes. See the [root AGENTS.md](../../AGENTS.md) for
monorepo-wide commands and conventions.

## What this package is

Private, unversioned (`0.1.0`) shared low-level utility package with a very
small surface:

- `src/index.ts`
- `src/remote/types.ts` — types for the remote-DOM bridging system
- `src/vitestBrowserTestConfig.ts` — a shared Vitest browser-mode config
  object, imported by both `components` and `remote-react-components` into
  their own `vitest.config.ts` to keep browser test setup consistent

## Notes

- No build step: `main` points straight at `src/index.ts`, consumed as TS
  source by other workspace packages via `workspace:*`.
- No dedicated test scripts of its own — this package is a config/type
  provider, not a tested library in its own right. Changes here are
  exercised indirectly through the `browser` test projects of the packages
  that consume `vitestBrowserTestConfig`.
