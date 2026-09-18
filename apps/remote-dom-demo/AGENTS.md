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
- CSS-module class names are typed by committed `*.module.d.scss.ts` stubs
  (shared generator, see the root
  [Generated code](../../AGENTS.md#generated-code--must-be-committed) table).
  `dev` regenerates them, which is the only thing that keeps them current — this
  app has no build or compile target, so unlike everywhere else CI neither
  type-checks them nor notices a stale one. Add or rename a class and commit
  what `pnpm nx build:scss-types remote-dom-demo` writes.
