# mittwald Flow — Agent Guide

Canonical guidance for AI coding agents (and a good primer for humans) working
in this repository. Package-specific deep dives live next to the code — see
[Where to look next](#where-to-look-next).

## What this project is

mittwald **Flow** is the design system of [mittwald](https://www.mittwald.de):
a React component library plus a remote-DOM rendering system that lets
[mStudio](https://developer.mittwald.de) extensions render sandboxed UI inside
the mittwald backoffice using real Flow components.

- User documentation: <https://flow.mittwald.de>
- Storybook: <https://storybook.flow-components.de>
- Remote rendering is based on a fork of
  [Shopify remote-dom](https://github.com/Shopify/remote-dom)

## The three systems

### 1. Design system core

React components in `packages/components` (most wrap
[react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html)
for accessibility), styled with SCSS modules and design-token CSS variables.
Icon sets, a standalone stylesheet package, and the docs site build on top of
it. Patterns are documented in
[packages/components/AGENTS.md](packages/components/AGENTS.md).

### 2. Remote DOM ("flr" = **Fl**ow **R**emote)

mStudio extensions run in a hidden iframe and render UI that the host
materializes with real Flow components:

```
extension (iframe)                          host (mStudio)
RemoteRoot + remote React components  ───►  RemoteRenderer + RemoteReceiver
   │  @quilted/threads connection              │
   └─ hidden remote DOM (flr-* elements) ───►  maps flr-* to Flow components
```

- `remote-core` owns connection + serialization (`@quilted/threads`). The
  protocol is **versioned** — the host negotiates with different remote
  versions at connection time. Keep this layer backwards compatible.
- Components tagged `/** @flr-generate all */` get generated artifacts: a
  `view.ts` next to the component, view components in
  `packages/components/src/views/`, and files under `src/auto-generated/` in
  `remote-elements`, `remote-react-components` and `remote-react-renderer`.
- **Props of `@flr-generate` components are a contract with extension
  developers.** Avoid breaking changes. When an API must change, keep the old
  path working and log usage with `useWarnDeprecation` (from
  `DeprecationWarningProvider`) so extension developers can be informed about
  deprecation paths they still use.
- Inside components that are part of the `flr-universal` export surface,
  compose other Flow components through their **views** (`@/views/*`) — views
  automatically switch to the remote counterpart in a remote context.

### 3. Token pipeline

`design-tokens` YAML files are defined together with UX — **design
authority**. Base tokens (colors, font, sizes, …) are taboo — never invent
or modify them. Adding **component tokens** for a new component is fine:
model them on existing components and ask when unsure.
[style-dictionary](https://styledictionary.com/) compiles YAML →
`dist/css` (CSS variables) and `dist/json`.

## Repository map

nx + pnpm workspace monorepo. Node `>=20.19`, pnpm pinned via
`packageManager` (use corepack). Several packages ship their own `AGENTS.md`
— **always read the nearest `AGENTS.md` before working in a package.**

| Path | Package | Role |
| --- | --- | --- |
| `packages/components` | `@mittwald/flow-react-components` | The heart: all React components. |
| `packages/design-tokens` | `@mittwald/flow-design-tokens` | Token source (YAML, design authority) → CSS vars + JSON via style-dictionary. |
| `packages/icons-base` | private | Icon source of truth (`src/icons.yaml`) + shared generator tooling. |
| `packages/icons`, `packages/icons-pro` | `@mittwald/flow-icons(-pro)` | Published icon sets, **fully generated** from `icons-base` (Tabler / FontAwesome). |
| `packages/stylesheet` | `@mittwald/flow-stylesheet` | Publishes the components' `all.css` as a standalone CSS package. |
| `packages/core` | private | Shared utilities: remote host config contract, shared Vitest browser config. |
| `packages/remote-core` | `@mittwald/flow-remote-core` | Connection + serialization layer (versioned protocol). |
| `packages/remote-elements` | `@mittwald/flow-remote-elements` | Custom elements (`flr-*`) for the remote side; largely auto-generated. |
| `packages/remote-react-components` | `@mittwald/flow-remote-react-components` | React API used *inside* remote apps (extensions); largely auto-generated. |
| `packages/remote-react-renderer` | `@mittwald/flow-remote-react-renderer` | Host-side renderer mapping `flr-*` elements to Flow components; map auto-generated. |
| `packages/ext-bridge` | `@mittwald/ext-bridge` | mStudio extension bridge (node/browser/react/i18next entries). |
| `packages/react-tunnel` | `@mittwald/react-tunnel` | Generic "portal for components" utility (MobX-based). |
| `packages/mstudio-ext-react-components` | `@mittwald/mstudio-ext-react-components` | Helpers for extension developers (mStudio page header customization). |
| `packages/codemods` | private | jscodeshift migrations for consumers. |
| `packages/typescript-config` | private | Shared tsconfig presets (`base`, `library`, `web-library`, `react-library`, `nextjs`). |
| `apps/docs` | private | User documentation site (Next.js); content in `src/content`, deployed to flow.mittwald.de. |
| `apps/remote-dom-demo` | private | Demo app for remote rendering. Remote-capable components should have a demo here. |

## Technology stack

- [nx](https://nx.dev/) — task orchestration (`affected`, caching, target deps)
- [pnpm](https://pnpm.io/) — workspace package manager
- [lerna-lite](https://github.com/lerna-lite/lerna-lite) — only used for publishing (versioning + changelogs from conventional commits)
- [Vite](https://vite.dev/) — component build; [vitest](https://vitest.dev/) incl. [browser mode](https://vitest.dev/guide/browser/) (Playwright-backed)
- [Storybook](https://storybook.js.org/) — component dev environment
- [react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html) — accessibility foundation
- [style-dictionary](https://styledictionary.com/) — design token compilation
- [SCSS modules](https://github.com/css-modules/css-modules) — component styling
- [jscodeshift](https://github.com/facebook/jscodeshift) — consumer codemods

## Commands

```shell
corepack enable && pnpm install            # setup
pnpm nx dev components                     # component dev env (Storybook, :6006)
pnpm build                                 # build everything (runs all generators)

pnpm test                                  # all unit + compile tests
pnpm affected:test                         # only affected vs. main (what CI runs)
pnpm nx test:unit components               # unit tests for one package
pnpm nx test:compile components            # tsc --noEmit for one package

pnpm test:browser:prepare                  # install Playwright browsers (once)
pnpm nx test:browser components --browser.name=webkit
pnpm affected:test:browser --parallel=1 --browser.name=webkit   # what CI runs
pnpm nx test:visual:update remote-react-components              # update visual snapshots

pnpm lint                                  # eslint + stylelint (pre-commit hook runs this)
pnpm format                                # prettier --write
```

## Generated code — must be committed

CI enforces `git diff --exit-code` after building: **generated files are
committed, and hand-editing them is futile** (headers say "auto-generated").

| Generated artifact | Generator |
| --- | --- |
| `packages/components/src/components/**/view.ts` + `src/views/*` | `pnpm nx build:remote-components components` |
| `packages/remote-{elements,react-components,react-renderer}/src/auto-generated/**` | same as above |
| `packages/components/src/components/Icon/components/icons/*` | `pnpm nx build:icons components` |
| `packages/icons/src/components/*`, `packages/icons-pro/src/components/*` | `pnpm nx build:icons icons` / `icons-pro` |
| `packages/components/dist/assets/doc-properties.json` (from prop JSDoc) | `pnpm nx build:docs-properties components` |

Changed props on an `@flr-generate` component, added an icon, or edited prop
JSDoc? Regenerate (or simply `pnpm build`) and commit the results.

## Development workflow

- **Conventional Commits** with component/package scope — `fix(Button): …`,
  `feat(components): …`. Releases and changelogs are generated from them.
- Merged PRs trigger the publish workflow (lerna-lite, fixed versioning across
  packages).
- **Maintain the nx wiring for scripts.** Every package script that nx
  orchestrates needs correct target metadata: `dependsOn` (ordering),
  `inputs`/`outputs` (caching, affected detection) in the package's
  `project.json` or in `nx.json` targetDefaults. When adding a script or a
  new generated artifact, wire these up — otherwise caching serves stale
  results and `nx affected` misses work.
- **Git hooks** (simple-git-hooks): `post-checkout` and `post-merge` run
  `pnpm install && pnpm clean` — expect installs after switching branches.
  `pre-commit` runs `pnpm lint`.
- **New dependencies:** pnpm enforces a `minimumReleaseAge` of one week
  (exempt: `@mittwald/*`) — brand-new versions won't resolve.
- **Breaking changes for consumers** ship with a `MIGRATION.md` entry and,
  ideally, a codemod in `packages/codemods` (tedious by hand — a great agent
  task).
- `patches/` contains intentional pnpm dependency patches — leave them alone.
- **Browser support:** all three engines (Chromium, Firefox, WebKit). CI
  running WebKit only is a pragmatic choice, not a support statement.

## Definition of Done — component work

A new or substantially changed component comes with:

1. Implementation following the patterns in
   [packages/components/AGENTS.md](packages/components/AGENTS.md)
2. Stories: `stories/Default.stories.tsx` with realistic args and meaningful
   variants
3. A docs page in `apps/docs/src/content/04-components/<category>/…`
4. Tests along the testing bar: unit tests for lib functions, browser tests
   for behavior (see the components AGENTS.md testing section)
5. UI text in `locales/de-DE.locale.json` **and** `locales/en-US.locale.json`
   (import pattern: i18n section of
   [packages/components/AGENTS.md](packages/components/AGENTS.md))
6. Public components exported from `src/components/public.ts`
   (`flr-universal.ts` additionally, only when remote-capable)
7. Remote-capable (`@flr-generate`): generated code regenerated + committed,
   and a demo page in `apps/remote-dom-demo`
8. Intentional visual changes: snapshots updated (`test:visual:update` or the
   `update-screenshots` PR label)

## Hard rules

- **Never hand-edit generated files** — regenerate and commit instead.
- **Base design tokens are taboo; visual design comes from UX** — compose
  existing tokens and patterns. Adding component tokens for a new component
  is fine (model them on existing components); when extending tokens, ask
  instead of inventing.
- **No breaking changes to `@flr-generate` component props** — deprecate with
  `useWarnDeprecation` instead.
- **Use views (`@/views/*`) for internal composition** in `flr-universal`
  components.
- **Only remote-capable components in a `PropsContext`** (see the
  PropsContext section of
  [packages/components/AGENTS.md](packages/components/AGENTS.md)).

## Where to look next

| Topic | Read |
| --- | --- |
| Component patterns, styling, testing, i18n | [packages/components/AGENTS.md](packages/components/AGENTS.md) |
| Remote connection & serialization | [packages/remote-core/AGENTS.md](packages/remote-core/AGENTS.md) |
| Remote elements / React API / host renderer | `packages/remote-{elements,react-components,react-renderer}/AGENTS.md` |
| Icon pipeline | [packages/icons-base/AGENTS.md](packages/icons-base/AGENTS.md) |
| Design tokens | [packages/design-tokens/AGENTS.md](packages/design-tokens/AGENTS.md) |
| Remote demo app | [apps/remote-dom-demo/AGENTS.md](apps/remote-dom-demo/AGENTS.md) |
