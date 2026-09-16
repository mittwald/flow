# @mittwald/flow-remote-svelte-components — Agent Guide

Svelte API used _inside_ remote apps, the counterpart of
[`remote-react-components`](../remote-react-components/AGENTS.md). **Prototype —
not published.** Read [README.md](./README.md) for the shape of the API and the
gaps, and
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md) for
what the bindings established about supporting a framework at all.

- `src/auto-generated/**` is **generated** from `packages/components`
  (`pnpm nx build:remote-components components`) — never edit by hand. The
  emitter is
  `packages/components/dev/remote-components-generator/generation/generateRemoteSvelteComponentFile.ts`.
- **The generated files are one `.svelte` component each**, and thin: everything
  the wrapper needs at runtime — properties, events — is already on the element
  class (`remotePropertyDefinitions`, `remoteEventDefinitions`), so
  `RemoteElement.svelte` reads it there instead of having the generator write an
  event map into every file. Only the **slot names** are emitted, because a
  component declares its snippet props as a _type_ and the element carries them
  at runtime only.
- **A `.svelte` file cannot export a type next to its component**, so the props
  types (`ButtonProps`, …) are re-exported by the generated `index.ts`, straight
  off the element class.
- **Props are passed through untouched.** Svelte hands a component its props
  with their casing intact, so `isDisabled`, `aria-label` and `data-testid` all
  arrive spelled the way the element declares them — there is nothing to
  camelize, and nothing should be. Only `class` is translated to `className`,
  because that is the attribute a Svelte author writes.
  `RemoteRendering.browser.test.ts` guards the dashed props; a well-meant
  normalization would break them silently.
- **The generated component passes its configuration as one `__flr` prop**, and
  spreads the app's props **before** it. As sibling props they would collide:
  every Flow form field takes a `name`, and
  `<RemoteElement name="TextField" {...props} />` lets `name="callsign"` win —
  the component then reports itself as "callsign" and the real `name` never
  reaches the host, because the wrapper destructures its own away. Two of the
  parity scenarios and `RemoteRendering.browser.test.ts` cover it.
- **`FlowRemoteProps` adds `data-testid` back.** The generator re-exports the
  **React component's** props type, and `data-testid` is declared one level
  below it, by `FlowRemoteElement`. Vue never noticed — its props arrive
  untyped.
- **Whitespace in a template would be a child of the remote element**, and
  `normalizeWhitespace.ts` is what keeps it out. Svelte drops the whitespace
  between two block-level HTML elements, but a `flr-*` element is a custom
  element and counts as inline — so a template written the ordinary way puts a
  text node into the remote tree, the host renders it as a child of the Flow
  component, and inside a `Section` every one of them is an extra flex item and
  an extra gap. Nothing about it is visible in the source. The normalizer blanks
  exactly those nodes: whitespace-only, inside a `flr-*` element, between two
  elements — a space between two expressions is the author's and stays, as does
  whitespace in plain DOM the app renders. `RemoteWhitespace.browser.test.ts`
  asserts both halves.
- **This package's own templates are additionally written compactly** where a
  component renders more than one thing inside a `flr-*` element — the children
  snippet and the slot wrappers in `RemoteElement.svelte`, the each-block in
  `CountryOptions.svelte`. There the neighbours are whatever the caller renders,
  which the normalizer's rule cannot judge.
- **`PropsContextProvider` is a real props context**, not a stand-in: Svelte's
  `setContext`/`getContext` is the same mechanism React uses, so it reaches the
  whole subtree rather than only the children a composite was handed (which is
  as far as Vue's `cloneVNode` gets). `RemoteElement.svelte` consumes its entry
  and clears the context for its own children — exactly what every
  `flowComponent` of type `ui` does with `ClearPropsContext`. A composite that
  configures a **changing** value puts a getter in the context object; it is
  read once, while a component below initializes.
- **`Parity.browser.test.ts` renders the same scenario through both bindings**
  and compares what the host produced. The scenarios are data
  (`src/tests/lib/parity/scenarios.ts`), so `Render.svelte` and the React
  `createElement` path can both build them — which is the only way a non-React
  binding can share a suite with React at all; the visual scenarios in
  `remote-react-components` are `(components) => ReactNode` and cannot be
  rendered here. Only react-aria's generated ids are normalized away.
- **`src/tests/*.browser.test.ts` runs the real thing:** a Svelte tree, the
  production serializer over a MessageChannel, and React's `RemoteRenderer` as
  the host. A value that would not survive `postMessage` fails here the way it
  fails in an extension. Run it with
  `pnpm nx test:browser remote-svelte-components --browser.name=webkit`.
- **`flr-universal` is rebuilt by hand** in `src/components/**` and
  `src/overlays/**` — `Modal`, `Popover`, `LightBox` and their trigger,
  `Action`, `NotificationProvider`, `SettingsProvider`, `CountryOptions`,
  `Wrap`, `BrowserOnly`, the deprecation provider. Those are React compositions
  **over** remote elements, not remote elements, so the generator never sees
  them. `List`/`ListItemView`/`typedList` are not rebuilt (5,500 lines).
- **The composites pass Flow's own class names** (`flow--modal`,
  `flow--popover`, …) to `OverlayContent`, because that is how the host is asked
  for a modal rather than a bare dialog. They are asserted in
  `Overlays.browser.test.ts`, so a rename in `packages/components` fails here
  rather than in an extension. Marking `Modal` and friends `@flr-generate` would
  remove them — it is the change this layer argues for.
- **A snippet is opaque, and that shapes two APIs.**
  `NotificationController.add` takes `autoClose` alongside the notification
  instead of reading it off the element, and `Wrap` takes its wrapper as a
  snippet that receives the content rather than as a child it reaches into.

## Build and tooling

- **The package ships source, not compiled output** (`svelte-package`). A
  compiled Svelte component imports `svelte/internal`, which is private and
  changes between minors. Consequences, all of them deliberate:
  - **No path aliases.** There is no bundler in the build, so every internal
    import is relative and carries its `.js` extension (`./types.js`,
    `./remoteContext.svelte.js`). `@/…` does not resolve.
  - **`svelte-check` replaces `tsc`** in `test:compile`; `tsc` only checks the
    Vite and Svelte config files. `tsconfig.json` spells out
    `moduleResolution: "bundler"` although `module: preserve` implies it —
    svelte-check runs its own language service and does not apply the
    implication, and without it every workspace import fails to resolve.
  - **`packageVersion` has no `define` to read.** Vite injects it for dev and
    test; the published files fall back to `0.0.0` until the build injects it.
    See `src/version.ts`.
- **`.svelte` files are outside eslint and prettier.** The repository's globs
  cover `.ts`/`.tsx`, so nothing formats them — which is why the generator emits
  its own formatting, and why the whitespace rule above is not enforced by a
  tool.
