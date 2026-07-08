# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor,
etc.) when working with code in this repository.

## Project overview

mittwald Flow is a design system. This repo is a pnpm workspace
(`packages/*`, `apps/*`) orchestrated by Nx (see `nx.json`). The root
`package.json` (`@mittwald/flow-project`) is private and only holds
workspace-level tooling; real package versions live per-package and are
managed by lerna-lite.

The project is in **early development** — no stability guarantees, breaking
changes happen between alpha releases.

## Architecture at a glance

Dependency flow between packages, base → top:

- `design-tokens` (`@mittwald/flow-design-tokens`) — style-dictionary based
  design tokens, built via a single `build-tokens.js` script. Publishes only
  built CSS/JSON artifacts (`./css/*`, `./json/*`), no JS/TS API.
- `icons-base` (private) — shared icon source of truth (`src/icons.yaml` +
  codegen templates), consumed by both `icons` and `icons-pro`.
- `icons` (`@mittwald/flow-icons`, Tabler-based) and `icons-pro`
  (`@mittwald/flow-icons-pro`, Tabler + FontAwesome Sharp Regular) — sibling
  packages that each codegen their own React icon components from
  `icons-base`.
- `core` (`@mittwald/flow-core`, private) — small shared utility package
  (types for the remote-DOM bridge, a shared Vitest browser-test config).
  Consumed directly as TS source (`workspace:*`), no build step.
- `components` (`@mittwald/flow-react-components`) — the main published
  package. Depends on `design-tokens`, `icons`, `core`; `icons-pro` is an
  optional peer dependency.
- `remote-core` / `remote-elements` / `remote-react-components` /
  `remote-react-renderer` / `ext-bridge` — "remote DOM" bridging layer built
  on top of `components`, for embedding Flow components in remote/iframe
  contexts (`@mittwald/remote-dom-react`).
- `apps/docs` (`@mittwald/flow-documentation`, private) — the Next.js +
  fumadocs-mdx documentation site deployed at flow.mittwald.de. Consumes
  `components` and `design-tokens` directly.
- Storybook (storybook.flow-components.de) is hosted from inside
  `packages/components` itself, not a separate app.

## Environment

- Requires Node `>=20.19` (see root `package.json` `engines`). If your
  default Node (e.g. via `nvm`) is older, some things fail in confusing ways
  rather than a clean version error: `packages/remote-react-components`'
  `vitest.config.ts` fails to even load (`TypeError [ERR_INVALID_ARG_VALUE]`
  from a rolldown/Node `util.styleText` incompatibility), and
  `pnpm nx dev components` (Storybook) refuses to start
  ("You need Node.js version 20.19+ or 22.12+"). If you hit either, run
  `node -v` first and switch to a newer Node before debugging further.

## Common commands

- `pnpm nx dev components` — start the dev environment (Storybook) for the
  components package.
- `pnpm build` — `nx run-many --targets=build --exclude docs`.
- `pnpm test` — fast tests, no browser: `nx run-many --targets=test:unit,test:compile`.
- `pnpm test:browser` — browser/e2e/visual tests: `nx run-many --targets=test:browser,test:e2e,test:visual`.
  Requires `pnpm test:browser:prepare` once (`pnpx playwright install --with-deps firefox webkit`).
- `pnpm affected:test` / `pnpm affected:test:browser` — same targets, scoped
  to Nx-affected projects (what CI runs against a PR).
- Run a single package's tests directly via Nx, e.g.
  `pnpm nx run components:test:unit -- <vitest args>`, or `cd` into the
  package and run its test runner directly (see the package's own
  `AGENTS.md` for exact syntax).
- `pnpm lint` — `eslint .` + `stylelint '**/*.{css,scss}'`. This also runs
  as the `pre-commit` git hook — do not bypass it.
- `pnpm format` — `prettier --write` across the repo.
- `post-checkout`/`post-merge` git hooks run `pnpm install && pnpm clean`
  (`clean` = `nx reset` plus each package's own `clean` target, which
  deletes generated files like built icons and `dist`). After switching
  branches, generated files may need rebuilding via the relevant `build:*`
  script.

Nx `targetDefaults` (`nx.json`) encode task dependencies that matter: most
`build`/`test:*` targets depend on `^build` (build of upstream workspace
packages first), and `test:compile`/`dev` additionally depend on
`build:icons`.

## Coding conventions

- ESLint (`eslint.config.js`): double quotes, semicolons required, Unix
  linebreaks, type-only imports enforced via
  `@typescript-eslint/consistent-type-imports` (separate `import type`
  statements), unused vars/args/caught errors are only allowed if their name
  matches `/[iI]gnored/`.
- Prettier (`.prettierrc.json`): printWidth 80, double quotes, trailing
  commas everywhere, `proseWrap: always`, plus plugins for sorting
  `package.json`/JSON keys and formatting JSDoc.
- Commits follow Conventional Commits (`feat(scope): ...`,
  `chore(release): ...`, etc.), matching the auto-generated changelogs.

## Versioning & changelogs

- lerna-lite manages versions; current scheme is `0.2.0-alpha.NNN`.
- `CHANGELOG.md` files are auto-generated per package — never hand-edit them.
- When introducing a breaking change to a released alpha API in
  `components`, add an entry to `packages/components/MIGRATION.md`.

## Things that will break CI/publishing if missed

- Regenerate icons (`build:icons`) after changing `icons-base` or its
  `icons.yaml` manifest.
- Regenerate remote components (`build:remote-components` in `components`)
  after changing `components`' public prop/API surface, so the remote-DOM
  bridge packages stay in sync.
- Keep lint/format conventions above, since `pnpm lint` is a commit gate.
- **Adding a brand-new component** (not just editing an existing one) needs
  a few extra steps beyond writing the `.tsx`, or things silently stay
  broken until someone notices at runtime:
  1. Export it from `packages/components/src/components/public.ts` —
     forgetting this compiles fine locally but makes the component
     unimportable from `@mittwald/flow-react-components`, which only
     surfaces later as a confusing `has no exported member 'Foo'` error in
     `remote-elements`/`remote-react-components`.
  2. Run `build:docs-properties` in `components` *before*
     `build:remote-components` — the latter reads
     `dist/assets/doc-properties.json`, which the former generates; running
     them out of order (or skipping the first) means the new component is
     silently missing from all generated remote-DOM artifacts, with no
     error.
  3. After codegen, rebuild not just `components` but also
     `remote-elements` and `remote-react-renderer` (e.g.
     `pnpm nx run remote-elements:build`, `pnpm nx run remote-react-renderer:build`).
     Skipping this leaves their `dist` stale, and remote-DOM rendering of
     the new component crashes at runtime with
     `No component found for remote element: flr-<name>` — a failure that
     only shows up when something actually tries to render the component
     through the remote bridge (e.g. the visual tests in
     `remote-react-components`), not at build/typecheck time.
