# @mittwald/flow-remote-react-renderer — Agent Guide

Host-side renderer: receives the remote DOM and materializes `flr-*` elements as
real Flow components. See the remote-DOM overview in the
[root AGENTS.md](../../AGENTS.md) and the full explainer in
[docs/remote-ui.md](../../docs/remote-ui.md).

- `src/auto-generated/**` (the component renderer map) is **generated** from
  `packages/components` — never edit by hand.
- Hand-written: `RemoteRendererBrowser` (hidden iframe + `RemoteReceiver`
  wiring) and special-case renderers merged in `src/components.ts`.
- `onComponentUsage` is **not** collected here. The remote reports which
  components an extension uses (see
  [docs/remote-ui.md](../../docs/remote-ui.md)); this package only receives the
  `ComponentRendered` event via `onEvent` and joins the lifecycle status from
  the generated registry. Collecting it host-side would measure the `flr-*`
  output tree, which is a different set than what the extension used.
