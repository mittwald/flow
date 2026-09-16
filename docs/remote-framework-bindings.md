# Supporting another framework in a remote app

What it takes to let an mStudio extension be written in something other than
React, and what bites on the way. Written from the Vue binding
([packages/remote-vue-components](../packages/remote-vue-components), published
as experimental); the findings are not Vue-specific.

Read [remote-ui.md](./remote-ui.md) first — this assumes the end-to-end picture.

## The short version

**The boundary is framework-agnostic; the layer above it is not.** A binding is
small where it wraps `flr-*` elements and large where it has to rebuild Flow's
React compositions. The Vue prototype is ~700 hand-written lines, of which the
element wrapper and the root are ~250 — the rest is `flr-universal`.

## What already works for any framework

| Layer                                                   | Framework-specific? |
| ------------------------------------------------------- | ------------------- |
| `remote-core` — connection, versioning, serialization   | no                  |
| `remote-elements` — the `flr-*` custom elements         | no                  |
| `remote-react-renderer` — the **host**                  | irrelevant          |
| `packages/components` — the components the host renders | irrelevant          |
| `flr-universal` — `Modal`, `List`, `Action`, …          | **yes, React**      |

The host being React is not a constraint on the remote side: what crosses the
boundary is a mutation of a DOM tree of custom elements, plus serialized
property values. Anything that can create an element and set a property on it
can drive it.

## What a binding has to provide

1. **An element wrapper factory.** Turns a `flr-*` element into a component of
   the target framework. Everything it needs is on the element class at runtime
   — `remotePropertyDefinitions`, `remoteEventDefinitions`,
   `remoteSlotDefinitions`, `remoteAttributeDefinitions`. Read them there and
   the generated per-component files stay one line each; the React package
   predates that and has the generator write an event map into every file.
2. **A remote root.** Connects to the host (`connectHostRenderRootRef` from
   `remote-core`), initializes ext-bridge, reports the app's pathname, forwards
   render errors, deprecation warnings and component usage, and exposes the host
   config.
3. **`Form`.** `flr-form` has no Flow component behind it, so the generator
   never emits it.
4. **A rebuild of `flr-universal`.** See below.
5. **An emitter in the generator**
   (`packages/components/dev/remote-components-generator`) plus the new output
   path in `packages/components/project.json`, so the generated surface stays in
   lockstep with the components.

## The traps

Each of these was found the hard way, and none of them errors when you get it
wrong.

- **Set properties imperatively, after the element is in the DOM.** Not through
  the framework's own attribute handling: a remote property is a JS value, not a
  string. The React binding does this in a layout effect, the Vue one in
  `onMounted`/`onUpdated`.
- **Every element needs `data-flr-initialized` and `data-flr-version`.** The
  host skips rendering a component that has not announced itself.
- **Do not normalize a prop name the element declares.** Flow declares dashed
  props — `aria-label`, `aria-expanded`, `data-testid` — and a binding that
  camelizes prop names to suit its own conventions loses them. `aria-*` hides
  the bug: the DOM reflects `ariaLabel` back onto the attribute, so it limps
  along. `data-testid` has no reflection and simply never arrives. Check
  `remotePropertyDefinitions`/`remoteAttributeDefinitions` before rewriting a
  key.
- **An event's name is the React prop without `on`, first letter lowercased** —
  `onPress` → `press`. Take the set from `remoteEventDefinitions` rather than
  deriving it.
- **Listener identity matters.** `FlowRemoteElement.addEventListener` wraps the
  listener and keys its map on the function it was handed, so
  `removeEventListener` has to pass that same reference back. Wrap a listener
  and you must keep both.
- **A prop carrying rendered output is a slot, never a property.** It travels as
  a child element `<flr-slot-root-wrapper slot="<name>">`, and `slot` reaches
  the remote tree through `attributeChangedCallback` — so it has to be set as an
  **attribute**, not a property. A framework that prefers properties for custom
  elements needs an escape hatch here (Vue: `^slot`).
- **A function property is a thread proxy.** Calling it is a round trip, so the
  host always receives a Promise. Flow types those props `Promise<T> | T` and
  awaits on the host; the ones that cannot be awaited are off the remote surface
  via `@flr-ignore-props`. A binding inherits both, but its tests should assert
  it (`AxisTickFormatter`).
- **Controlled fields need echo suppression.** A field reports every keystroke
  and gets the value back a round trip later; applying that echo drops
  everything typed since. The remote side marks the echo with
  `controlledRemoteValueMarker` and the host renders its own mirror. The tag
  list is in the binding (`flr-text-field`, `flr-number-field`, …). React has to
  ask whether the current change came from a remote event, because a local Flow
  component calls the same handler — a binding with no local Flow components
  does not.
- **One object reference used twice in a batch used to serialize as
  `undefined`** (#2894). Fixed in `remote-core`, but a binding's test suite
  should cover the shape, because the symptom is a component that renders empty
  with no error anywhere.
- **Test through the real serializer.** A harness that hands the host the
  receiver's live connection passes values as the very objects the test created,
  and a serializer that drops half of them still goes green. Route through
  `FlowThreadSerialization` over a `MessageChannel`
  (`src/tests/lib/serializedConnection.ts` — copy it).

## `flr-universal` is the expensive part

`Modal`, `ModalTrigger`, `Popover`, `PopoverTrigger`, `LightBox`,
`LightBoxTrigger`, `Action`, `ActionBatch`, `List`, `ListItemView`,
`NotificationProvider`, `SettingsProvider`, `CountryOptions`, `Wrap`,
`BrowserOnly`, `IntlProvider`, `DeprecationWarningProvider` — React components
that _emit_ remote elements rather than being one. A binding cannot import them,
so it rebuilds them, and two things make that harder than it looks:

- **`PropsContext` has no equivalent.** Flow configures the components inside a
  composite — the `Heading` of a `Modal`, the `Button` of an `Action` — through
  a React context that every `flowComponent` reads. A binding has to reach its
  children directly (Vue: `cloneVNode`), which covers one level rather than the
  whole subtree.
- **The composites pass Flow's internal class names.** `Modal` asks for
  `flow--overlay flow--modal flow--modal--size-s` on an `OverlayContent`,
  because that is what makes the host render a modal rather than a bare dialog.
  Every binding repeats them, and a rename in `packages/components` breaks all
  of them silently.

**The fix is on the Flow side, not in the bindings.** Marking the overlay family
`@flr-generate` would let the host materialize the whole composition from one
element — no class names, no props-context stand-in, and every binding gets them
from the generator. The cost: the React remote package exports both
`./auto-generated` and `flr-universal`, so a generated `Modal` collides with the
re-exported one and the star export goes ambiguous. The generator would have to
skip the re-export for names `flr-universal` already carries; the list is
already parsed for the status registry
(`dev/status-registry/parseFlrUniversalComponentNames.ts`).

Two things stay out of reach regardless:

- **`List` / `ListItemView` / `typedList`** — 5,500 lines of data sources,
  filters, sorting, pagination and persisted view settings. Its own project.
- **Icons.** `@mittwald/flow-icons` ships React components. A binding can put a
  raw `<svg>` inside `Icon` — plain elements travel as remote DOM — but there is
  no icon set to import. The path data is generated from
  `packages/icons-base/src/icons.yaml`, so a framework-agnostic export (paths,
  not components) would serve every binding.

## Checklist for a new binding package

- `packages/remote-<framework>-components`. It ships as soon as `private` is
  absent — and a brand-new package name needs its npm **Trusted Publisher**
  registered first (`publish.yml`, one workflow filename per package), or the
  first publish fails with `E404 Not found` in the middle of a release.
- `project.json` with `implicitDependencies: ["components"]` and a `build` that
  depends on `components:build:remote-components`.
- An emitter in the generator + the output path in `components/project.json`.
- `AGENTS.md` and `README.md` stating what is generated, what is hand-written,
  and what is missing.
- Unit tests for the controllers and the tree helpers; browser tests that render
  the binding's tree through the real serializer against
  `@mittwald/flow-remote-react-renderer`.
- Port the React package's component tests — they encode the bugs that are worth
  never having again: `RemoteEventListenerRemoval`, `RemoteControlledValue`,
  `RemoteSerialization`, `OptionKeys`, `AxisTickFormatter`,
  `OverlayTriggerInTunnel`.
- A page in `apps/remote-dom-demo` per demo it can serve, behind the framework
  switcher.

## Open questions

- **Does every binding own its `flr-universal` rebuild, or does Flow move the
  compositions behind generated elements?** Every binding added before that
  decision pays for it twice.
- **What is the support promise?** The React package's props are a contract with
  extension developers (no breaking changes, deprecate instead). A second
  binding either inherits that promise — and the release process with it — or is
  explicitly experimental.
- **One demo app or one per framework?** The switcher in `remote-dom-demo`
  works, but each framework needs its own route tree, and only one remote may be
  connected at a time.
