# AGENTS.md — @mittwald/flow-react-components

Package-specific notes. See the [root AGENTS.md](../../AGENTS.md) for
monorepo-wide commands and conventions.

## What this package is

The main published package — a React implementation of Flow. Built with Vite
(`vite build --config vite.build.config.ts`) and shipped as multiple entry
points: default, `/internal`, `/flr-universal`, `/nextjs`, `/react-hook-form`,
`/mittwald-password-tools-js`, `/all.css`, `/doc-properties`.

Depends on `design-tokens`, `icons`, `core` (dev); `icons-pro` is an optional
peer dependency.

## Codegen — re-run after touching the source

- `build:icons` (`tsx dev/icons/generate.ts`) — re-run after adding/changing
  icons in `icons-base`.
- `build:remote-components`
  (`tsx dev/remote-components-generator/generateRemoteComponents.ts`) — re-run
  after changing a component's public props/API, so the `remote-*` bridge
  packages stay in sync.
- `build:docs-properties` (`tsx dev/createDocPropertiesJson.ts`) — emits
  `doc-properties.json` (react-docgen-typescript prop docs), consumed by
  `apps/docs`.
- `clean` deletes `dist` and `src/components/Icon/components/icons/*` — confirms
  icons are code-generated into that path, not hand-written.

## Testing (Vitest, three projects in `vitest.config.ts`)

- `unit` project — `src/**/*.test.{ts,tsx}` (excludes `*.browser.test.*`). Run
  via `test:unit`. To run a single file:
  `pnpm vitest run --project=unit src/components/Button/Button.test.tsx` (add
  `-t "test name"` to filter by name).
- `browser` project — `src/**/*.browser.test.{ts,tsx}`, uses the shared
  `vitestBrowserTestConfig` from `packages/core` plus
  `./dev/vitest/setupBrowser.ts`. Run via `test:browser`. Single file:
  `pnpm vitest run --project=browser src/components/Button/Button.browser.test.tsx`.
- `unit-dev` project — `dev/**/*.test.{ts,tsx}` (Node environment), for testing
  internal tooling scripts (e.g. the generators above).
- `test:compile` is `tsc --noEmit` — type-check only, not a test runner.
- There are no `test:e2e`/`test:visual` scripts in this package (those live in
  `remote-react-components`).

## Component folder convention

Each component lives under `src/components/<ComponentName>/`:

- `<ComponentName>.tsx` — implementation
- `<ComponentName>.module.scss` — styles
- `view.ts` — rendering/view-model helper (where present)
- `index.ts` — barrel export
- `stories/Default.stories.tsx` — Storybook story
- `<ComponentName>.test.tsx` or `<ComponentName>.browser.test.tsx` — colocated
  tests

**New component checklist** — a component's own `index.ts` barrel is not enough
to make it part of the package's public API: it must also be re-exported from
`src/components/public.ts` (alphabetically), or it won't be importable from
`@mittwald/flow-react-components` at all — see the root
[AGENTS.md](../../../AGENTS.md) "Things that will break CI/publishing if missed"
for the full new-component checklist (public.ts export → rebuild order →
downstream package rebuilds).

## Other rules

- `CONTRIBUTE.md` in this package documents one specific rule: avoid using
  non-remote components inside `PropsContext`/`PropsContextProvider` when
  remote-component support matters.
- `MIGRATION.md` documents breaking changes per alpha version range — add an
  entry here whenever you ship a breaking change to a released alpha API.
