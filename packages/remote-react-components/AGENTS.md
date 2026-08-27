# @mittwald/flow-remote-react-components — Agent Guide

> **Building an mStudio extension _with_ this package?** Read
> [USAGE.md](./USAGE.md) instead — the remote surface, which props cross the
> boundary, and what survives serialization. This guide is about changing the
> package itself.

React API used _inside_ remote apps (mStudio extensions). This package's exports
are what extension developers program against — **treat its API as a contract**
(see the remote-DOM rules in the [root AGENTS.md](../../AGENTS.md) and the full
explainer in [docs/remote-ui.md](../../docs/remote-ui.md)).

- `src/auto-generated/**` is **generated** from `packages/components` — never
  edit by hand.
- `createFlowRemoteComponent` reports **component usage** for the components the
  `flowComponent` factory does not build (54 of 131); the factory reports the
  rest. Renders that arrive through a Flow view are excluded — see the view seam
  in [docs/remote-ui.md](../../docs/remote-ui.md).
- Hand-written: `RemoteRoot` (connects to the host render root, initializes
  ext-bridge) and the `createFlowRemoteComponent` machinery.
- Richest test surface outside `components`: unit, browser, e2e and visual
  tests. **Visual tests must pass in both environments — `Local` and `Remote`**
  (see `CONTRIBUTE.md` and `src/tests/lib/environments.tsx`).
- **`Remote` goes through the real serializer.** It routes every mutation
  through `FlowThreadSerialization` over a MessageChannel
  (`src/tests/lib/serializedConnection.ts`), matching what production does, so
  each visual scenario guards the transport as well as the rendering. It used to
  hand `<RemoteRoot />` the receiver's live connection — props arrived as the
  very objects the test created, and a serializer that dropped half of them
  still passed the whole suite, which is how #2894 shipped green. Two
  consequences: **a value handed to a remote component must survive
  `postMessage`'s structured clone**, so an element-valued prop has to be a slot
  rather than a remote property (see `isSlot` in the components generator); and
  a scenario failing only in `Remote` with a blank container is usually the
  transport, not the tree.
- **New or changed rendered behavior always gets a visual test here** — add a
  new `src/tests/visual/<Name>.browser.test.tsx` or extend the existing one so
  the new prop/variant/layout is captured. Because every scenario runs in both
  `Local` and `Remote`, this single test guards the component and its remote
  path at once.
- **The browser also selects the theme:** webkit renders light, firefox renders
  dark (`dev/vitest/setupVisualTheme.ts`), so one run covers both themes and the
  `*-firefox-*.png` baselines are dark by design. A run filtered with
  `--browser.name=<one>` only verifies one theme.
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
