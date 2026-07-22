# @mittwald/flow-remote-react-components — Agent Guide

React API used _inside_ remote apps (mStudio extensions). This package's exports
are what extension developers program against — **treat its API as a contract**
(see the remote-DOM rules in the [root AGENTS.md](../../AGENTS.md) and the full
explainer in [docs/remote-ui.md](../../docs/remote-ui.md)).

- `src/auto-generated/**` is **generated** from `packages/components` — never
  edit by hand.
- Hand-written: `RemoteRoot` (connects to the host render root, initializes
  ext-bridge) and the `createFlowRemoteComponent` machinery.
- Richest test surface outside `components`: unit, browser, e2e and visual
  tests. **Visual tests must pass in both environments — `Local` and `Remote`**
  (see `CONTRIBUTE.md` and `src/tests/lib/environments.tsx`).
- **New or changed rendered behavior always gets a visual test here** — add a
  new `src/tests/visual/<Name>.browser.test.tsx` or extend the existing one so
  the new prop/variant/layout is captured. Because every scenario runs in both
  `Local` and `Remote`, this single test guards the component and its remote
  path at once.
- Update visual snapshots: `pnpm nx test:visual:update remote-react-components`.
  Updating everything takes long — for a single component use
  `pnpm nx test:visual:update remote-react-components MyNewComponent`.
- **The `Remote` environment resolves the built `dist` of the remote packages,
  not their source.** After changing a component's `@flr-generate` props (which
  regenerates `src/auto-generated/**`), rebuild the remote chain before running
  or updating visual tests — otherwise the `Remote` render uses a stale `dist`,
  silently drops the new prop, and you get a misleading baseline that only fails
  on the host side. Force a fresh build with
  `pnpm nx run-many -t build -p components remote-elements remote-react-components remote-react-renderer --skip-nx-cache`,
  then update snapshots.
- Failing visual tests write `*--Local--*.png` / `*--Remote--*.png` diff
  artifacts — useful for inspection, **never commit them**. Only the baselines
  (`<Name>-<browser>-<os>.png`) belong in the repo.
