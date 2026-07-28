# @mittwald/flow-remote-react-renderer — Agent Guide

Host-side renderer: receives the remote DOM and materializes `flr-*` elements as
real Flow components. See the remote-DOM overview in the
[root AGENTS.md](../../AGENTS.md) and the full explainer in
[docs/remote-ui.md](../../docs/remote-ui.md).

- `src/auto-generated/**` (the component renderer map) is **generated** from
  `packages/components` — never edit by hand.
- Hand-written: `RemoteRendererBrowser` (hidden iframe + `RemoteReceiver`
  wiring) and special-case renderers merged in `src/components.ts`.
