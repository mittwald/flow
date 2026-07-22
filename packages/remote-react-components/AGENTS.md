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
- Failing visual tests write `*--Local--*.png` / `*--Remote--*.png` diff
  artifacts — useful for inspection, **never commit them**. Only the baselines
  (`<Name>-<browser>-<os>.png`) belong in the repo.
