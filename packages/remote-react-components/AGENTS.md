# AGENTS.md — @mittwald/flow-remote-react-components

Package-specific notes. See the [root AGENTS.md](../../AGENTS.md) for
monorepo-wide commands and conventions, and this package's own
[CONTRIBUTE.md](CONTRIBUTE.md) for the visual-testing conventions (how
`test.each(testEnvironments)` / Local vs. Remote rendering works, the
`*--Remote--1.png` / `*--Local--1.png` divergence-screenshot mechanism, the
`update-screenshots` PR-label workflow for Linux CI baselines, and why
hover-state screenshots are discouraged) — read that first before writing a
new visual test, it already covers most of what you'd otherwise have to
learn by trial and error.

## Gotchas not covered by CONTRIBUTE.md

- **Node version**: this package's `vitest.config.ts` fails to even load on
  Node < 20.19 (a rolldown/`util.styleText` incompatibility throws
  `TypeError [ERR_INVALID_ARG_VALUE]` before any test runs). If
  `pnpm vitest run --project=visual` (or `unit`/`browser`) fails immediately
  with that error, check `node -v` first — see the root
  [AGENTS.md](../../AGENTS.md) "Environment" section.
- **Stale downstream builds break "Remote" tests, not "Local"**: if a
  `test.each(testEnvironments)` test fails only for `(Remote)` with
  `Error: No component found for remote element: flr-<name>`, it means
  `packages/remote-elements` and/or `packages/remote-react-renderer` have a
  stale `dist` that doesn't yet know about a newly added/regenerated
  component — rebuild both (e.g. `pnpm nx run remote-elements:build`,
  `pnpm nx run remote-react-renderer:build`) after running the
  `build:remote-components` codegen in `components`, not just
  `components` itself.
- A `*--Remote--1.png` / `*--Local--1.png` file left in `__screenshots__`
  after a failed run isn't just "the other environment's diverging
  baseline" (per CONTRIBUTE.md) — it can also be a leftover artifact from a
  run that crashed/timed out before the real
  `<description>-<browser>-<platform>.png` screenshot could be taken (e.g.
  due to the stale-build issue above). Delete these and re-run once the
  underlying issue is fixed rather than treating them as real Local/Remote
  rendering differences to reconcile.
- Interaction screenshots that open a `Popover`/`ContextMenu` (click →
  screenshot) can flake by ~1% pixel diff locally due to popover-position
  timing, independent of the "hover is flaky" note already in
  CONTRIBUTE.md — if a diff looks like the whole popover content shifted by
  about one line/row rather than a real style/color change, suspect timing
  flakiness before assuming a component regression.
