# @mittwald/flow-remote-vue-components — Agent Guide

Vue API used _inside_ remote apps, the counterpart of
[`remote-react-components`](../remote-react-components/AGENTS.md). **Prototype —
not published.** Read [README.md](./README.md) for the shape of the API and the
gaps, and
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md) for
what this prototype established about supporting a framework at all.

- `src/auto-generated/**` is **generated** from `packages/components`
  (`pnpm nx build:remote-components components`) — never edit by hand. The
  emitter is
  `packages/components/dev/remote-components-generator/generation/generateRemoteVueComponentFile.ts`.
- **The generated files are one line each**, unlike React's. Everything the
  wrapper needs at runtime — properties, events, slots — is already on the
  element class (`remotePropertyDefinitions`, `remoteEventDefinitions`,
  `remoteSlotDefinitions`), so `createFlowRemoteComponent` reads it there
  instead of having the generator write an event map into every file. Only the
  **slot names** are emitted, because a Vue component declares its slots as a
  _type_ and the element carries them at runtime only.
- **The component type is annotated, not inferred.** Four chart components
  (`Area`, `CartesianChart`, `ChartTooltip`, `Line`) reference a type that is
  not reachable from this package's module graph, and inference fails with
  TS2883. The annotation names it through the props alias the file imports
  anyway.
- **Props arrive through `attrs`, not declared props.** Declaring them would
  mean shipping a second copy of the Flow prop contract. The cost is that Vue
  does not camelize the keys, so `createFlowRemoteComponent` does it — without
  that, a template written in Vue's own kebab-case (`:is-disabled`) silently
  produces a DOM attribute instead of a remote property, and nothing errors.
- **Events are matched by name, not by a map.** `@press` and `@press-change`
  both compile to `onPress` / `onPressChange` (Vue's compiler camelizes a v-on
  argument), and the element's event is that name without `on`.
- **A slot prop is a Vue slot, never a property.** Rendered output does not
  survive structured clone — same rule as React's `isSlot` (see the root
  [AGENTS.md](../../AGENTS.md)). The wrapper renders it into
  `flr-slot-root-wrapper` with `slot="<name>"`, forced to an _attribute_
  (`^slot`) because that is how the remote tree learns about it
  (`attributeChangedCallback`).
- **`src/tests/RemoteRendering.browser.test.ts` runs the real thing:** a Vue
  tree, the production serializer over a MessageChannel, and React's
  `RemoteRenderer` as the host. A value that would not survive `postMessage`
  fails here the way it fails in an extension. Run it with
  `pnpm nx test:browser remote-vue-components --browser.name=webkit`.
- **`flr-universal` is rebuilt by hand** in `src/components/**` and
  `src/overlays/**` — `Modal`, `Popover`, `LightBox` and their triggers,
  `Action`, `NotificationProvider`, `SettingsProvider`, `CountryOptions`,
  `Wrap`, `BrowserOnly`, the deprecation provider. Those are React compositions
  **over** remote elements, not remote elements, so the generator never sees
  them. `List`/`ListItemView`/`typedList` are not rebuilt (5,500 lines).
- **Two things make the rebuilds possible, and both are worth knowing.**
  `mapChildren` (`src/overlays/childProps.ts`) stands in for `PropsContext`: it
  `cloneVNode`s the children the composite was handed, which reaches one level
  rather than the whole subtree. And the composites pass Flow's own class names
  (`flow--modal`, `flow--popover`, …) to `OverlayContent`, because that is how
  the host is asked for a modal rather than a bare dialog. Marking `Modal` and
  friends `@flr-generate` would remove both — it is the change this layer argues
  for.
- **A composite's class names are asserted in the browser tests**
  (`Overlays. browser.test.ts`), so a rename in `packages/components` fails here
  rather than in an extension.
