# @mittwald/flow-remote-core — Agent Guide

Connection + serialization layer between host (mStudio) and remote apps
(extensions). See the remote-DOM overview in the
[root AGENTS.md](../../AGENTS.md) and the full explainer in
[docs/remote-ui.md](../../docs/remote-ui.md).

- Built on `@quilted/threads` (patched via `patches/`) and a fork of
  [Shopify remote-dom](https://github.com/Shopify/remote-dom). The fork lives at
  <https://github.com/mfal/remote-dom>, branch `publish/mittwald` (published as
  `@mittwald/remote-dom-*`).
- The connection protocol is **versioned**: the host reacts to different remote
  versions at connection time. **Changes here must stay backwards compatible** —
  extensions in the wild connect with older versions.
- `FlowThreadSerialization` controls which values cross the thread boundary
  (deliberately excludes `HTMLElement`/`window`).
- **The patch makes serialization `async`** — Flow's serializers await File
  reads, which upstream's synchronous serializer cannot express. That turns
  upstream's cycle guard into an invariant the traversal has to keep: it parks
  `undefined` in a `seen` map while a value is in flight, so **arrays, Maps and
  Sets must serialize their members sequentially**. Restore a `Promise.all`
  there and a reference that appears twice in one batch reads the placeholder
  mid-flight and silently serializes to `undefined` — no error, no warning, the
  component just renders empty (#2894). Sequential is also the faster of the two
  on real payloads; `Promise.all` allocates a promise per member.
- **The patch also orders messages.** Async serialization takes a number of
  microtask turns proportional to the payload, so two calls made in one task
  race: upstream posts inside the caller's stack frame, this build posts after
  an `await`. Without a queue a larger batch followed by a smaller one arrives
  second, and the host applies the tree in the wrong order — silently. `Thread`
  keeps a `#sendQueue` (serialize then post, atomic per call) and a
  `#receiveQueue` (deserialize then invoke, atomic per message). The receive
  queue is released when the export is **invoked**, not when it settles:
  awaiting completion would let one slow export stall the channel and deadlock
  any export that calls back into the paired thread.
  `threadMessageOrder.test.ts` covers both, including that a slow export stays
  overtakeable.
- **Rendered output cannot be a remote property.** React tags elements with
  `$$typeof: Symbol(react.…)`; symbols pass through serialization untouched and
  `postMessage` refuses them — refusing the **whole** message, so one element in
  one prop drops the entire mutation batch and the extension renders nothing.
  `FlowThreadSerialization` therefore drops React values (`null`, warned once
  per component) so the cost stays one property instead of the whole update.
  That is a net, not a fix: the prop belongs in a **slot**. The generator fails
  the build on such a prop — see `checkSerializableProps` in the components
  package.
- Unit tests run in happy-dom: `pnpm nx test:unit remote-core`. The repeated
  reference and circular reference cases in `FlowThreadSerialization.test.tsx`
  are what fails if the sequential invariant breaks;
  `threadMessageOrder.test.ts` is what fails if the ordering queues break. The
  boundary itself is covered end-to-end by `renderRemoteSerialized` in
  `remote-react-components`.
- **`dist` bundles `@quilted/threads`.** The remote packages resolve built
  `dist`, and the patched threads code is inlined into it — so a patch change is
  invisible to the browser and visual suites until `pnpm nx build remote-core`
  runs. Swapping the file in `node_modules` alone proves nothing.
