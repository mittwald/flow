# @mittwald/flow-remote-vue-components — Agent Guide

Vue API used _inside_ remote apps, the counterpart of
[`remote-react-components`](../remote-react-components/AGENTS.md). **Published,
but experimental** — no stability promise until `List` exists. Read
[README.md](./README.md) for the shape of the API and the gaps, and
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md) for
what this prototype established about supporting a framework at all.

- **Before the first release, npm needs a Trusted Publisher for this package
  name**, bound to `publish.yml` — npm allows one workflow filename per package
  and reports a missing binding as `E404 Not found`, mid-release, after the
  other packages have already gone out. Nothing in this repository can set it
  up; it is a one-time step on npm.
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
- **`src/icons/components/**` is generated too**, by `dev/icons/generate.ts`
  from `getIconSources()` in `icons-base` — the same `icons.yaml` the React sets
  come from. `pnpm nx build:icons remote-vue-components`, committed like every
  other generated artifact. The Tabler path data is **inlined** for the reason
  it is inlined in `@mittwald/flow-icons`: a consumer should not have to install
  `@tabler/icons-react` (74 MB, ~24,000 files). That inlining is what puts the
  Tabler MIT notice in this package's LICENSE.
  - **A Flow icon is not a remote element.** It is `Icon` with an `<svg>` inside
    it, and the host merges `flow--icon…`, `role` and the ARIA onto that same
    `<svg>`. So the binding's whole job is to emit the `<svg>` React emits —
    Tabler's attribute set, the path data, the `tabler-icon…` classes.
  - **Every SVG attribute is forced (`^`)**, because Vue would otherwise set a
    matching DOM property, and an SVG element's properties are read-only
    `SVGAnimatedLength`s rather than the strings the host has to receive.
  - **No pro set.** `packages/icons-pro` renders FontAwesome Pro, which each
    consumer licenses itself and which therefore cannot be inlined. A Vue pro
    set would need that package as a peer dependency, and `IconSetProvider` has
    no Vue counterpart either.
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
- **The React package's visual corpus is the parity gate** (`e2e/react-parity`,
  `pnpm nx test:parity remote-vue-components`). It renders the whole corpus
  twice — once from `remote-react-components`, once from here — and asserts the
  host builds the same DOM. The corpus is reused **unmodified**: the harness
  aliases `@/tests/lib/environments` to its own environment, the way the
  cross-version harness does. 171 of 187 scenarios are compared; the rest are
  listed in `knownGaps.ts` with a reason — `List.browser.test.tsx` as a whole
  file (every scenario in it needs Flow's `List`), the others by name.
  - A scenario's React element tree is rebuilt as Vue vnodes by `reactToVue.ts`:
    `type` → export name → Vue component, element-valued props → slots. A
    scenario that defines a React component of its own cannot be converted, and
    says so.
  - **Nothing is committed.** The references are written from React on every
    run, so they cannot drift into a second source of truth.
  - **Stable is not settled.** Each pass reads the host's DOM until it stops
    changing — but the output also stops changing _while_ the host waits on an
    async job of its own, and the two passes then each get their own coin flip.
    `PasswordCreationField` validates its empty value on mount and holds
    `complexity-indicator--loading` until that resolves, which outlasts the
    sampling window on a loaded runner and fails the run on a class no remote
    tree decides. `pendingMarkers` in `environments.ts` waits those out; add to
    it rather than normalizing the class away in `hostHtml.ts`, so a marker that
    never clears still reaches the comparison.
  - `knownGaps.divergingScenarios` entries are **self-cleaning**: one that
    starts matching fails the run, naming the entry to delete.
- **`flr-universal` is rebuilt by hand** in `src/components/**` and
  `src/overlays/**` — `Modal`, `Popover`, `LightBox` and their triggers,
  `Action`, `NotificationProvider`, `SettingsProvider`, `CountryOptions`,
  `Wrap`, `BrowserOnly`, the deprecation provider. Those are React compositions
  **over** remote elements, not remote elements, so the generator never sees
  them. `List`/`ListItemView`/`typedList` are not rebuilt (5,500 lines).
- **Two things make the rebuilds possible, and both are worth knowing.**
  `mapChildren` (`src/overlays/childProps.ts`) stands in for `PropsContext`: it
  `cloneVNode`s the children the composite was handed, which reaches one level
  rather than the whole subtree. A second level costs an explicit
  `mapSlottedChildren`, which rebuilds the child around a wrapped default slot —
  `Modal` needs it to tell the `Action`s inside its `ActionGroup` not to ask for
  confirmation. **Call the slot's result through `Array.isArray`**: a slot
  written `() => h(X)` hands back one vnode, because Vue only normalizes a slot
  when the component itself reads it. And the composites pass Flow's own class
  names (`flow--modal`, `flow--popover`, …) to `OverlayContent`, because that is
  how the host is asked for a modal rather than a bare dialog. Marking `Modal`
  and friends `@flr-generate` would remove both — it is the change this layer
  argues for.
- **`Modal confirmOnClose` carries its own translations.** Flow's four strings
  live in `Modal/locales/*.locale.json`, are compiled into the React bundle by a
  locale plugin, and are not importable from a published package — so
  `src/overlays/Modal.ts` repeats them for `de-DE` and `en-US`. A rewording on
  the Flow side drifts here without failing anything.
- **A composite's class names are asserted in the browser tests**
  (`Overlays. browser.test.ts`), so a rename in `packages/components` fails here
  rather than in an extension.
