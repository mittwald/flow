# @mittwald/flow-remote-core — Agent Guide

Connection + serialization layer between host (mStudio) and remote apps
(extensions). See the remote-DOM overview in the
[root AGENTS.md](../../AGENTS.md).

- Built on `@quilted/threads` (patched via `patches/` — leave the patch alone)
  and a fork of [Shopify remote-dom](https://github.com/Shopify/remote-dom).
  The fork lives at <https://github.com/mfal/remote-dom>, branch
  `publish/mittwald` (published as `@mittwald/remote-dom-*`).
- The connection protocol is **versioned**: the host reacts to different
  remote versions at connection time. **Changes here must stay backwards
  compatible** — extensions in the wild connect with older versions.
- `FlowThreadSerialization` controls which values cross the thread boundary
  (deliberately excludes `HTMLElement`/`window`).
- Unit tests run in happy-dom: `pnpm nx test:unit remote-core`.
