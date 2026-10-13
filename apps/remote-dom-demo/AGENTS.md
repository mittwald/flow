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
- `pnpm nx test:compile remote-dom-demo` type-checks the app (`tsc --noEmit`).
  It runs in CI via `affected:test`, and depends on `^build` and
  `build:scss-types`, so it sees freshly built workspace packages and freshly
  generated stubs. There is still no `build` target — nothing here runs
  `next build`, so errors only a production build surfaces stay unseen.
- **The Vue demos are JSX, against their own runtime.** Each file starts with
  `/** @jsxImportSource @/app/remote-vue/_lib */`, which points Next's compiler
  and TypeScript at `src/app/remote-vue/_lib/jsx-runtime.ts` — so a Vue demo
  reads like the React page beside it, which is the point. Vue's own
  `vue/jsx-runtime` works too, but it hands a component its children as a value
  and Vue then warns "Non-function value encountered for default slot" once per
  element; the local runtime wraps them. **The wrapper copies the children on
  every call**: JSX builds them once, when the parent renders, but a component
  calls its slot again on each render of its own, and Vue mounts a vnode in
  place — handing it the same nodes twice is the reuse
  `packages/remote-vue-components/src/tests/List.browser.test.ts` documents
  losing a popover. Named and scoped slots are the Vue JSX idiom,
  `<Comp>{{ name: () => … }}</Comp>`, and pass through untouched — their
  functions build fresh nodes per call already. `react/jsx-key` is off only in
  the demos that hand a slot a static array of children (`eslint.config.js`
  lists them); everywhere else it checks the keys Vue needs on `.map()` output.
- **A Vue demo runs against the built package**, not its source: it imports
  `@mittwald/flow-remote-vue-components` through the package entry, which is
  `dist`. After changing that package, `pnpm nx build remote-vue-components`
  (`pnpm nx dev remote-dom-demo` and the parity targets build it first). The
  parity harnesses serve that `dist` as it is: their prebundles, under each
  harness's `e2e/*/.vitest`, hold npm dependencies only — the `@mittwald/**/*`
  glob in the package's `optimizeDeps.include` matches no workspace package.
- CSS-module class names are typed by committed `*.module.d.scss.ts` stubs
  (shared generator, see the root
  [Generated code](../../AGENTS.md#generated-code--must-be-committed) table).
  Add or rename a class and commit what
  `pnpm nx build:scss-types remote-dom-demo` writes — `test:compile` regenerates
  them first, so a stale committed stub surfaces in CI's "Check all generated
  code is committed" step, not as a type error.
- `types.d.ts` pulls in Next's global ambient types (`*.css` side-effect
  imports, image imports) with reference directives. Next writes the same
  directives to `next-env.d.ts`, but that file is generated and gitignored, so
  it is absent in a fresh CI checkout and `test:compile` would fail without this
  committed stand-in.
