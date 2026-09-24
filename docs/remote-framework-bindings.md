# Supporting another framework in a remote app

What it takes to let an mStudio extension be written in something other than
React, and what bites on the way. Written from the Vue binding
([packages/remote-vue-components](../packages/remote-vue-components), published
as beta); the findings are not Vue-specific.

Read [remote-ui.md](./remote-ui.md) first — this assumes the end-to-end picture.

## The short version

**The boundary is framework-agnostic; the layer above it is not.** A binding is
small where it wraps `flr-*` elements and large where it has to rebuild Flow's
React compositions. The Vue binding is ~7,300 hand-written lines, tests left
out, against ~2,700 generated ones in 135 files. The element wrapper, its
`v-model` mapping and the root are ~750 of them; the rest is `flr-universal`,
and 3,300 of that is the `List` alone.

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
   the generated per-component files name only what the class cannot tell at
   runtime — for Vue, the slot names and the boolean props; the React package
   predates that and has the generator write an event map into every file. Map
   the framework's two-way binding too (`v-model` in Vue): it compiles to keys
   no element knows, and a field bound that way shows nothing and never writes
   back.
2. **A remote root.** Connects to the host (`connectHostRenderRootRef` from
   `remote-core`), initializes ext-bridge, reports the app's pathname, forwards
   render errors, deprecation warnings and component usage, and exposes the host
   config.
3. **`Form`.** `flr-form` has no Flow component behind it, so the generator
   never emits it.
4. **The icon set.** `@mittwald/flow-icons` ships React components, so a binding
   generates its own from `getIconSources()` in `packages/icons-base` — the
   default set as data, with no framework in it (Tabler path data, custom SVG
   parsed into a node tree). What it emits is not a remote element: a Flow icon
   is `Icon` with an `<svg>` inside, and the host merges its classes, its `role`
   and its ARIA onto that same `<svg>`. So the binding only has to produce the
   `<svg>` React produces. Inline the path data rather than depending on
   `@tabler/icons-react` (74 MB, ~24,000 files), and carry Tabler's MIT notice
   in the package's LICENSE.
5. **A rebuild of `flr-universal`.** See below.
6. **An emitter in the generator**
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
- **A slot's result is not normalized until the component reads it.** A binding
  that inspects or rewrites what a child renders — the props-context stand-in
  reaching a second level — calls the slot function the vnode carries, and that
  hands back whatever the author wrote: one node for `() => h(X)`, a list for
  `() => [h(X)]`. Vue normalizes it only on the way into the component, so the
  helper has to. It fails as an empty render rather than an error.
- **Test through the real serializer.** A harness that hands the host the
  receiver's live connection passes values as the very objects the test created,
  and a serializer that drops half of them still goes green. Route through
  `FlowThreadSerialization` over a `MessageChannel` (import
  `packages/remote-react-components/src/tests/lib/serializedConnection.ts` by
  relative path — do not copy it).

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
  whole subtree. Every rule Flow writes for a _grandchild_ then costs its own
  code: `Modal` alone has three (`ActionGroup > Action`, `Content > Heading`,
  `ColumnLayout > AccentBox`), and each of them is a behaviour an extension
  developer will notice missing rather than a detail.
- **The composites need Flow's UI text, and it is not published.** A `Modal`
  with `confirmOnClose` asks "You have unsaved changes…" in the backoffice's
  language. Those strings live in the component's `locales/*.locale.json`, are
  compiled into the React bundle by a locale plugin, and no published entry
  point exposes them — so every binding carries its own copy and drifts when
  Flow rewords one. A framework-agnostic export of the locale files would fix it
  for all of them, the way `getIconSources()` did for the icons.
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

One thing was a project of its own, and it is the worked example for every
other:

- **`List` / `ListItemView`** — it runs **entirely in the extension**, since
  only the leaves (`ListEmptyView`, `ListItemViewContent`, `ListSummary`,
  `ItemsGridList`) are remote elements, so there is no host-side `List` a
  binding could delegate to.

  What coupled it to React was not TanStack: `@tanstack/react-table` is a thin
  wrapper over `@tanstack/table-core`, and `useReactTable` is `createTable` plus
  a `useState`. It was that the model is a graph of classes whose **constructors
  call hooks** — the "class-method custom hooks" pattern this repository already
  keeps `rules-of-hooks` switched off for.

  The way through is `packages/components-base`: ~1,600 lines of MobX with no
  framework in them, holding everything the list decides — the loader state,
  sorting, search, filters, batching, the item collection, the view mode and the
  table, whose `useState` is an observable. Each binding brings the subscription
  (~15 lines: `useSelector`, `watchMobxValue`) and the one job the shared model
  leaves open, which is fetching a batch. React was rewired onto each piece as
  it moved, so both bindings run the same rules rather than two copies of them.

  Two things stay per binding, and both are shapes of the same problem.
  Fetching, because Suspense has no Vue counterpart: Vue's list drives the async
  loader from a watcher, and a loader written as a **composable** needs a
  component per batch, since a composable runs in `setup()` and nowhere else —
  which is what React's `DataLoader` does with its hooks loader. And
  `typedList`, which has no Vue counterpart at all: the item type comes from the
  `ListItem` slot.

- **The pro icon set.** `packages/icons-pro` renders FontAwesome Pro, which each
  consumer licenses itself — so unlike Tabler's, its path data cannot be
  inlined, and a binding would need that package as a peer dependency. Rebuild
  `IconSetProvider` instead and the gap becomes an app's to fill: it is a React
  context, a dozen lines in any framework, and the only way a binding's users
  get a second icon set at all. Note that the React **remote** package does not
  export it — it lives in `@mittwald/flow-react-components` — so this is a place
  where a binding can reasonably go beyond its counterpart.

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
- **A parity harness against the React package's visual corpus.** This is the
  cheapest strong test a binding can have, and the Vue one
  (`packages/remote-vue-components/e2e/react-parity`) is the worked example:
  render every scenario twice — once from React, once from the new binding — and
  assert the host builds the same DOM. Three things make it work:
  - The corpus is reused **unmodified**, by aliasing `@/tests/lib/environments`
    to the harness's own environment. Copying the scenarios instead guarantees
    the copy drifts.
  - A scenario's React element tree is rebuilt as the binding's vnodes. A React
    element is plain data, and both packages export the same names, so the
    mapping is a name lookup. Scenarios that define a React component of their
    own cannot be converted — they describe React state, not a remote tree.
  - The references are **written from React on every run and never committed**.
    The claim is "the binding renders what React renders today", and a committed
    baseline would quietly become a second source of truth.

  Normalize only what two renders of the _same_ tree differ in, or the
  comparison reports noise:

  - rewrite generated ids and collection keys to numbered placeholders, so which
    label points at which control is still compared;
  - compare `style` per declaration and rewrite only what depends on the clock
    or the font (a spinner's `--animation-delay`, CodeMirror's caret);
  - read the overlays the host portals to `document.body`, minus per-document
    leftovers (the live announcer, recharts' measuring span, an empty overlay
    container, description nodes nothing references);
  - run both passes in the same file order, since a scenario sees what earlier
    files left in the document;
  - fail a full run on a known-gap entry that names no scenario.

  Attribute and class order are normalized too; they carry no meaning. **Reading
  "until the output stops changing" is not enough**: it also stops changing
  while the host waits on an async job of its own (a policy validation, a
  fetch), so each pass gets its own coin flip on a class that no remote tree
  decides. Wait those states out by their marker rather than normalizing the
  marker away — one that never clears then still reaches the comparison.
  Everything else stays, and that is where a dropped prop or a mis-named event
  surfaces. Keep the gaps in a list with reasons rather than skipping silently,
  and make the entries self-cleaning: one that starts matching should fail, so a
  closed gap cannot keep its exemption.

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
- **When does a second binding get the support promise?** The React package's
  props are a contract with extension developers (no breaking changes, deprecate
  instead). The Vue binding ships as **beta** — the lifecycle status that
  exempts a component from that promise, applied to the whole package — and what
  ends the beta is not decided yet.
- **One demo app or one per framework?** The switcher in `remote-dom-demo`
  works, but each framework needs its own route tree, and only one remote may be
  connected at a time.
