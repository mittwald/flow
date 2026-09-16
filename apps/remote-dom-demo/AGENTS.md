# remote-dom-demo — Agent Guide

Next.js demo app exercising the remote rendering stack (remote components,
events, forms, suspense, ext-bridge, navigation, performance).

- New remote-capable components (`@flr-generate`) should get a demo page here —
  it is part of the Definition of Done (see the
  [root AGENTS.md](../../AGENTS.md)).
- **Next 16 differs from what a model was trained on** — APIs, conventions and
  file structure moved. Read the relevant guide in
  `node_modules/next/dist/docs/` (resolved from this directory; in this monorepo
  `next` is not visible from the repo root) before writing Next code.
  `next dev`'s own managed AGENTS.md block is off — see `agentRules` in
  `next.config.js`.
- Run with `pnpm nx dev remote-dom-demo`.
- **Every `/host/…` page shows a React/Svelte switch.** The React demos are one
  page each under `/remote`; the Svelte ones are components in a registry
  (`src/app/remote-svelte/_app/demos.js`) that a single catch-all route serves,
  and a demo the Svelte app does not have falls back to `NotPorted.svelte`. Only
  the selected tab holds a frame — two live remotes both follow the host's
  pathname and both report their own back, so they overwrite each other's
  navigation.
- **The Svelte app is plain JavaScript, deliberately.** `svelte-loader` is wired
  into Turbopack (`next.config.js`) without a preprocessor, because a Turbopack
  rule's options have to be serializable and a preprocessor is a function — so
  `lang="ts"` does not compile here. Both rules emit `*.mjs`: `as: "*.js"` on a
  component would land on `X.svelte.js`, which the rune-module rule then
  compiles a second time.
- **The Svelte app routes itself** (`DemoRoot.svelte`). Next's router in that
  loop is one frame behind what the app already decided, and the two overwrite
  each other until the host snaps back to the previous demo.
- CSS-module class names are typed by committed `*.module.d.scss.ts` stubs
  (shared generator, see the root
  [Generated code](../../AGENTS.md#generated-code--must-be-committed) table).
  `dev` regenerates them, which is the only thing that keeps them current — this
  app has no build or compile target, so unlike everywhere else CI neither
  type-checks them nor notices a stale one. Add or rename a class and commit
  what `pnpm nx build:scss-types remote-dom-demo` writes.
