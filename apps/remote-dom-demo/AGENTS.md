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
  element; the local runtime wraps them. Named and scoped slots are the Vue JSX
  idiom, `<Comp>{{ name: () => … }}</Comp>`, and pass through untouched. React's
  JSX lint rules are switched off for this directory in `eslint.config.js`.
- **A Vue demo runs against the built package**, not its source: it imports
  `@mittwald/flow-remote-vue-components` through the package entry, which is
  `dist`. After changing that package, `pnpm nx build remote-vue-components` —
  and delete `packages/remote-vue-components/node_modules/.vite*` before a
  parity run, because vite pre-bundles it and a rebuilt `dist` does not
  invalidate the prebundle.
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
