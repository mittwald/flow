# Supporting another framework in a remote app

What it takes to let an mStudio extension be written in something other than
React, and what bites on the way. Written from two prototypes —
[packages/remote-vue-components](../packages/remote-vue-components) and
[packages/remote-svelte-components](../packages/remote-svelte-components) — and
the findings are not specific to either.

Read [remote-ui.md](./remote-ui.md) first — this assumes the end-to-end picture.

## The short version

**The boundary is framework-agnostic; the layer above it is not.** A binding is
small where it wraps `flr-*` elements and large where it has to rebuild Flow's
React compositions. In both prototypes the element wrapper and the root are a
few hundred lines — the rest is `flr-universal`.

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
  `onMounted`/`onUpdated`, the Svelte one in an `$effect`.
- **Every element needs `data-flr-initialized` and `data-flr-version`.** The
  host skips rendering a component that has not announced itself.
- **Do not normalize a prop name the element declares.** Flow declares dashed
  props — `aria-label`, `aria-expanded`, `data-testid` — and a binding that
  camelizes prop names to suit its own conventions loses them. `aria-*` hides
  the bug: the DOM reflects `ariaLabel` back onto the attribute, so it limps
  along. `data-testid` has no reflection and simply never arrives. Check
  `remotePropertyDefinitions`/`remoteAttributeDefinitions` before rewriting a
  key. Vue's template compiler forces the question; Svelte hands a component its
  props untouched, so the answer there is to leave them alone — and keep a test
  on it, because the normalization is exactly the kind of thing a later change
  adds back.
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
  elements needs an escape hatch here (Vue: `^slot`; Svelte: an action calling
  `setAttribute`).
- **Whitespace in a template becomes a child of the component.** A compiler that
  keeps the whitespace between two nodes puts a text node into the remote tree,
  and the host renders it as a child of the Flow component. Inside a `Section`,
  which lays out with `flex`, every one of them is an anonymous flex item and a
  second gap — and nothing about it is visible in the source. Svelte does this
  for every `flr-*` element, because it drops whitespace only between two
  block-level **HTML** elements and a custom element counts as inline; the
  binding normalizes it (`normalizeWhitespace.ts`) rather than making it a rule
  extension developers have to know. Vue's `h()` never produces one, but a Vue
  binding with SFC templates would hit the same thing.
- **The wrapper's own props collide with the component's.** A wrapper needs to
  know which element to render, which component it is, and which of its props
  are slots — and a framework that passes props as a flat bag has no separate
  channel for that. Every Flow form field takes a `name`, so
  `<Wrapper name="TextField" {...props} />` lets `name="callsign"` win: the
  component reports itself as "callsign" for usage, looks its props context up
  under it, and the real `name` never reaches the host at all, because the
  wrapper destructured its own away. The `FormData` the host collects is missing
  the field and nothing anywhere says so. Put everything the wrapper needs under
  one key the Flow surface does not use, and spread the app's props **before**
  it (Svelte: `__flr`).
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
- **The props type the generator re-exports is the React component's, not the
  element's.** `FlowRemoteElement` declares `data-testid` for every component;
  the React props type does not. A binding that types its component props
  strictly has to add it back — and a binding that passes props untyped never
  learns that it is missing.

## `flr-universal` is the expensive part

`Modal`, `ModalTrigger`, `Popover`, `PopoverTrigger`, `LightBox`,
`LightBoxTrigger`, `Action`, `ActionBatch`, `List`, `ListItemView`,
`NotificationProvider`, `SettingsProvider`, `CountryOptions`, `Wrap`,
`BrowserOnly`, `IntlProvider`, `DeprecationWarningProvider` — React components
that _emit_ remote elements rather than being one. A binding cannot import them,
so it rebuilds them, and two things make that harder than it looks:

- **`PropsContext` may or may not have an equivalent.** Flow configures the
  components inside a composite — the `Heading` of a `Modal`, the `Button` of an
  `Action` — through a React context that every `flowComponent` reads. How close
  a binding gets depends entirely on what the framework lets it do with the
  children it was handed:
  - **Vue** reaches them directly (`cloneVNode`), which covers one level rather
    than the whole subtree.
  - **Svelte** cannot look inside a snippet at all, so it rebuilds the context
    itself (`setContext`/`getContext`) — which turns out to be the _same_
    mechanism React uses, and reaches the whole subtree. The generated wrapper
    clears it for its own children, the way every `flowComponent` of type `ui`
    wraps them in a `ClearPropsContext`. Nothing else in the binding gets closer
    to Flow's own behavior.
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

And one component cannot be rebuilt with the same signature everywhere: **`Wrap`
takes its wrapper as a child and renders that child's children when the
condition fails.** That needs a framework that can reach inside the child. The
Svelte binding takes the wrapper as a snippet receiving the content instead —
different API, same purpose, and arguably the clearer one.

## Testing a binding against the React one

**The visual suite cannot take a third environment.** Its scenarios are
`(components) => ReactNode`
(`remote-react-components/src/tests/lib/visualScenario.ts`), which is exactly
what lets one scenario run both `Local` and `Remote` — and exactly what a
non-React binding cannot render. Rewriting 86 scenarios per binding is not a
suite, it is a second suite.

What does work is a scenario that is **data**: a component name, its props, its
children. Both bindings can build it — the React one with `createElement`, the
Svelte one with a recursive component — and then the host's DOM is the
assertion. Same component, same props, same rendering, or the binding is wrong.

It is cheaper than a screenshot and stricter where it matters: a prop that never
arrived is a missing attribute, not a few pixels. The `name` collision above was
found by hand and is now caught by five of eleven scenarios
(`remote-svelte-components/src/tests/Parity.browser.test.ts`). Only react-aria's
generated ids are normalized away; everything else has to be identical.

The per-binding regression tests stay next to it — `RemoteEventListenerRemoval`,
`RemoteControlledValue`, `RemoteSerialization` — because those are about the
binding's own machinery rather than about agreeing with React.

## Packaging

A binding ships the way its ecosystem expects, and that decides more than it
looks like:

- **Vue** ships compiled JavaScript from a Vite library build, like every other
  package here. Path aliases (`@/…`) work, because a bundler resolves them.
- **Svelte** ships **source** via `svelte-package`: a compiled Svelte component
  imports `svelte/internal`, which is private and changes between minors, so
  compiled output would bind consumers to one exact runtime. The consequence is
  that there is no bundler in the build — no path aliases, so every internal
  import is relative and carries its `.js` extension, and `svelte-check`
  replaces `tsc` in `test:compile`. The version `define` a Vite build injects
  has no equivalent either.

## Checklist for a new binding package

- `packages/remote-<framework>-components`, `private: true` until it ships.
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
- **How many bindings is the generator willing to carry?** Each one adds an
  emitter, an output path and a package that has to stay green. Three is fine;
  the question is where the line is, and whether a binding without a user should
  be in the repository at all.
