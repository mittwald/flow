# @mittwald/flow-remote-elements — Agent Guide

Custom elements (`flr-*`) representing Flow components on the remote side.
See the remote-DOM overview in the [root AGENTS.md](../../AGENTS.md).

- `src/auto-generated/**` is **generated** from `packages/components`
  (`pnpm nx build:remote-components components`) — never edit by hand.
- Hand-written parts live in `src/lib/` (e.g. `FlowRemoteElement`, the base
  class all Flow remote elements extend) plus a few special elements
  (Form, SlotRootWrapper).
