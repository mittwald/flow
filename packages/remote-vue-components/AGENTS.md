# @mittwald/flow-remote-vue-components — Agent Guide

Vue API used _inside_ remote apps, the counterpart of
[`remote-react-components`](../remote-react-components/AGENTS.md). **Beta** —
extensions can be built against it, but the API is exempt from Flow's
breaking-change promise until the beta ends, which is when the gaps are closed
and the surface has settled. Read [README.md](./README.md) for the shape of the
API and the gaps, and
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md) for
what this binding establishes about supporting a framework at all.

- **Before the first release, npm needs a Trusted Publisher for this package
  name**, bound to `publish.yml` — npm allows one workflow filename per package
  and reports a missing binding as `E404 Not found`, mid-release, after the
  other packages have already gone out. Nothing in this repository can set it
  up; it is a one-time step on npm.
- `src/auto-generated/**` is **generated** from `packages/components`
  (`pnpm nx build:remote-components components`) — never edit by hand. The
  emitter is
  `packages/components/dev/remote-components-generator/generation/generateRemoteVueComponentFile.ts`.
- **The generated files name only what the element cannot tell at runtime.**
  Properties and events are on the element class (`remotePropertyDefinitions`,
  `remoteEventDefinitions`), so `createFlowRemoteComponent` reads them there
  instead of having the generator write an event map into every file, as React's
  does. Two lists are emitted: the **slot names**, because a Vue component
  declares its slots as a _type_ and the element carries them at runtime only;
  and the **boolean props**, because a bare attribute
  (`<TextField is-required>`) arrives as `""`, which the host reads as false.
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
    set would need that package as a peer dependency.
  - **`IconSetProvider` is the one component here with no remote React
    counterpart.** React's is exported from `@mittwald/flow-react-components`
    and _not_ from `flr-universal`, so a remote React extension cannot swap its
    icons at all. It earns its place because there is no Vue pro set: it is how
    an app brings its own. Its `IconSet` is **partial** where React's is
    `typeof defaultIconSet` — React can demand every icon because `icons-pro` is
    a complete second set to hand it, and even its own test casts a two-entry
    set through `as unknown`. An icon a Vue set leaves out keeps Flow's.
- **The component type is annotated, not inferred.** Four chart components
  (`Area`, `CartesianChart`, `ChartTooltip`, `Line`) reference a type that is
  not reachable from this package's module graph, and inference fails with
  TS2883. The annotation names it through the props alias the file imports
  anyway.
- **Props arrive through `attrs`, not declared props.** Declaring them would
  mean shipping a second copy of the Flow prop contract. The cost is that Vue
  does not camelize the keys, so `createFlowRemoteComponent` does it — without
  that, a template written in Vue's own kebab-case (`:is-disabled`) silently
  produces a DOM attribute instead of a remote property, and nothing errors. **A
  key that disappears is cleared explicitly**, because a render function that
  builds its props conditionally drops the key rather than passing `undefined` —
  and a sync that only walks what is there now would leave the element on the
  last value it was handed.
- **Events are matched by name, not by a map.** `@press` and `@press-change`
  both compile to `onPress` / `onPressChange` (Vue's compiler camelizes a v-on
  argument), and the element's event is that name without `on`.
- **`v-model` is mapped, not declared** (`src/lib/vModel.ts`). Vue compiles it
  to `modelValue` plus `onUpdate:modelValue` (or `<arg>` plus `onUpdate:<arg>`),
  keys no element knows — left alone, a field shows nothing and never writes
  back, silently. A prop is bindable when Flow makes it controllable, which it
  spells with a `default*` sibling, and when the element has the event reporting
  it: `isOpen` → `openChange`, `inputValue` → `inputChange`, `selectedKey` →
  `selectionChange`, `value` and `isSelected` → `change`. `.trim` and `.number`
  are applied by hand, since no `emit` runs. The types in `src/lib/types.ts`
  follow the same `default*` rule.
- **A reactive array or object is watched deeply.** Changed in place, it is the
  same reference, and both the wrapper and remote-dom skip a property whose
  value is identical — so `data.value.push(point)` never reached the host. A
  change hands the element a shallow copy, which is what crosses.
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
- **The `List` has a parity harness of its own** (`e2e/list-parity`), because
  the corpus cannot express it. It is written against a list of **bindings**
  rather than against React and Vue: `harness/bindings/*` each mount a remote
  app, the first is the reference, and every other is compared against it — so a
  third framework is a new file and one key per scenario, not a new harness. Two
  things it does that the corpus harness does not:
  - **It asserts coverage.** A list of class names has to appear somewhere in
    what was compared. Comparisons that all pass say nothing about a component
    that stopped being rendered.
  - **Both sides are hand-written**, so a scenario can use each binding's own
    authoring style — `typedList<T>()` on the React side, slots on the Vue side.

  What both harnesses share is how they read (`hostOutput`, `hostHtml`): the
  root container plus whatever the host portalled to `document.body` — a menu, a
  modal — minus the per-document singletons. react-aria keeps one live announcer
  for the whole document, filled when something is announced and emptied on a
  timer, so a search in one scenario was still announcing "0 matches" while the
  next was read; it is left out by its `data-live-announcer` attribute. Both
  also settle before they park the pointer, for the reason `testScreenshot`
  gives. And a scenario that waits on something asynchronous of its own — the
  search's submit delay — waits for its result in `interact`, because the output
  stops changing while it waits and reads as stable.

- **The React package's visual corpus is the parity gate** (`e2e/react-parity`,
  `pnpm nx test:parity remote-vue-components`). It renders the whole corpus
  twice — once from `remote-react-components`, once from here — and asserts the
  host builds the same DOM. The corpus is reused **unmodified**: the harness
  aliases `@/tests/lib/environments` to its own environment, the way the
  cross-version harness does. 175 of 193 scenarios are compared; the rest are
  listed in `knownGaps.ts` with a reason — `List.browser.test.tsx` as a whole
  file (every scenario in it needs Flow's `List`), the others by name.
  - **A stale known gap fails the run.** A full run has the React pass write
    vitest's JSON report, and every `knownGaps.ts` entry has to name a corpus
    file or scenario in it (`dev/react-parity/staleKnownGaps.ts`); a
    `divergingScenarios` entry whose scenario matches again fails as well. An
    `unsupportedScenarios` entry claims the converter refuses the scenario, so a
    full run converts exactly those once more and fails on one that no longer
    throws `UnsupportedScenarioError`.
  - **Both passes run the files in one order.** A scenario sees what earlier
    files left in the document, so the order is part of the comparison.
    CodeMirror's `cm-nonmatchingBracket` counts as pending: a truncated
    CodeBlock's parse had not reached the closing brace in one pass under load.
  - `test:parity:dev` writes the React references before it watches the Vue
    pass, so a missing reference fails instead of being written from Vue, and
    leaves out what a full run leaves out.
  - **A password is masked only once one was generated.** The generate button
    produces a value neither pass can predict; a value the scenario typed is
    content and stays compared.
  - `src/tests` is type-checked by `tsconfig.vite.json`, whose `rootDir` is the
    repository root — it imports the React package's test tooling by relative
    path.
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
    tree decides. A chart is the other shape of this: recharts wraps an area in
    an `animationClipPath` layer on the first render that has points and drops
    it on the next, so one pass read whole `<g>` layers the other never had.
    `pendingMarkers` in `environments.ts` waits both out; add to it rather than
    normalizing the class away in `hostHtml.ts`, so a marker that never clears
    still reaches the comparison.
  - `knownGaps.divergingScenarios` entries are **self-cleaning**: one that
    starts matching fails the run, naming the entry to delete.
- **`flr-universal` is rebuilt by hand** in `src/components/**` and
  `src/overlays/**` — `Modal`, `Popover`, `LightBox` and their triggers,
  `Action`, `NotificationProvider`, `SettingsProvider`, `CountryOptions`,
  `Wrap`, `BrowserOnly`, the deprecation provider. Those are React compositions
  **over** remote elements, not remote elements, so the generator never sees
  them. `List` and `ListItemView` are rebuilt too, in `src/list/**` — but only
  their _arrangement_: every rule the list follows now lives in
  `packages/components-base` and is the same code React runs, so what is written
  here is which remote elements the host is asked for, plus the one job the
  shared model deliberately leaves open, which is fetching a batch. `typedList`
  has no counterpart — Vue infers the item type from the `ListItem` slot.
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
- **The overlay controller keeps Flow's names, so it keeps Flow's meaning.**
  `close()` asks first on a `confirm-on-close` modal, and only
  `close({ bypassConfirmation: true })` does not — code ported from React that
  closes through the controller would otherwise drop unsaved input unasked.
  `useOverlayController(type)` and `useModalController()` hand back the
  surrounding overlay's controller of that type (`reuseControllerFromContext`,
  on by default). And an overlay's `controller` prop is followed rather than
  read once (`useOwnController`): the context it provides reads the controller
  when asked, so an `Action` inside resolves the current one.
- **The Vue `List` reads its configuration off its children**, the way Flow's
  React list does: `ListStaticData`, `ListItem`, `ListFilter`, `ListSorting`,
  `ListSearch`, `ListLoaderAsync` and `ListLoaderComposable` render nothing and
  exist to be found (`src/list/setupComponents.ts`). Two things differ from
  React by necessity. A loader is a **prop**, not a scoped slot — Vue normalizes
  a slot's return into vnodes, so a slot hands back a rendered nothing instead
  of its promise. And `ListItemView` routes its children into the remote
  element's slots by component type, because Flow's React version does that with
  tunnels and a props context, neither of which exists here.
- **The list is built once and follows its children.** React rebuilds its model
  on every render; this one keeps an instance, so what a render says has to be
  carried over (`ListModel.updateSetup`). The filters, sortings and search are
  rebuilt when their props change — compared by a hash that leaves functions
  out, because a closure is new on every render and reads refs anyway. Their
  state is the table's, so a rebuild keeps what the user selected. A loader's
  `dependencies` reload every batch, a server-side sorting (`manualSorting`)
  resets the loader state as a filter does, and the static data is kept as a
  copy so an array changed in place still compares as changed.
- **A composable loader loads through a component per batch**
  (`src/list/ComposableLoader.ts`), not through the watcher the async one uses:
  a composable runs in `setup()` and nowhere else. React's `DataLoader` does the
  same with its hooks loader, one component per batch. Two consequences. The
  consumer is handed the query as a **getter**, because its composable is called
  once and a value would freeze at the query the first batch had. And the
  component reports whenever the batch is not `"loaded"` — a reset clears that
  state, and without the second report a changed filter would leave the list in
  a skeleton forever. The options getter reads `listTable.revision`: the search
  term is table state, and `getState()` hands back plain data that no `autorun`
  can track.
- **Everything the list reads from the table goes through
  `listTable.revision`.** The rows come out of the options _and_ the state, and
  only `revision` moves when either does — `renderedItems` and `isEmpty` both
  read it. Leaving it out is silent and looks like a race: the loader reports
  its batch, the data reaches the table one turn later, and a component that
  observed only the loader keeps the answer from before — an empty view reading
  "No items available" over its own items.
- **A batch starts as `"void"`, not as missing.** `ListLoaderState` begins with
  `["void"]`, so a loader driver that only looks for an absent entry never loads
  the first batch. A list whose data array is rebuilt each render hides that,
  because the change resets the state and makes the batch missing for real.
- **The list's settings go through `ListSettingsPort` into this package's own
  `SettingsProvider`** (`src/list/settings.ts`), in React's exact format: one
  entry per provider (`localStorage[storageKey]`, or a `type="custom"` store),
  holding `{"List":{"<key>.<setting>[.autosave]":"<json>"}}` — each value
  JSON-encoded once more. So the two bindings read each other's values. The
  provider's API is React's too (`type`, `storageKey`, async `store`, `id`,
  `middleware`, nested providers), and a list persists only inside one.
  Unvalidated, unlike React's, which parses each value with a zod schema: a
  value that is not what it should be is dropped by the model anyway (an unknown
  filter value is deleted on mount, an unknown sorting never matches), and
  malformed JSON counts as not stored.
- **The table view mode's elements are named `ListTable*`.** This package
  already exports the standalone Flow table's `Table`, `TableColumn` and friends
  from `src/auto-generated`, and two star exports offering one name resolve to
  nothing — silently, with the component reaching the host as `undefined`. A
  column's label is its **children**, not a prop: Flow's `TableColumn` renders
  `children`, and React's list only looks like it uses a `name` because it
  spreads both.
- **A filter's `priority` decides where it appears.** A `primary` filter gets
  its own menu in the header; a `secondary` one is only in the all-filters modal
  — which is also what puts that modal on desktop at all, since without a
  secondary filter its button carries `hide-on-desktop` too and it becomes the
  mobile-only path. Both rules are Flow's, and a Vue list that ignored them
  would show every filter twice.
- **Flow's `results.show` is ICU; this binding splits it in two.** The string is
  `{n, select, 1 {…} other {…}}`, and `useListTexts` is a `{name}` formatter
  rather than an ICU parser, so the two branches are `results.show.one` and
  `results.show.other` and the choice is made in code. A string that needed a
  real plural rule would be the point to stop copying and generate the `List`.
- **Selection is handed through, not implemented.** `selectionMode` and the rest
  reach the host's grid list and table untouched, the way Flow's React list
  passes them on — the keys, the keyboard and the checkboxes are theirs.
- **A bare `ContextMenu` in an item gets the button that opens it.** Flow's
  React `ListItemView` does that through its props context
  (`wrapWith: <OptionsButton/>` plus `placement="bottom right"`), so the remote
  tree it sends carries a `flr-context-menu-trigger`. A binding that routes the
  menu into the `button` slot as written sends a `flr-context-menu` instead —
  and the host renders a menu with nothing to open it, which looks like an item
  that simply has no menu. `e2e/list-parity` has the scenario.
- **The element types are the authoring surface, so they carry a call
  signature.** `Component` is a union that includes a plain options object,
  which JSX rejects with "does not have any construct or call signatures" — so
  the icons are `FlowIconComponent` and the list's setup elements are
  `ListSetupComponent` (functional, over an open record, because their props are
  the list's contract rather than the component's). A consumer writing JSX needs
  both; `apps/remote-dom-demo/src/app/remote-vue` is the worked example.
- **An expandable item is a component, not a few lines in `Items`.** Each one
  holds whether it is open, and a render function has nowhere to keep that.
  `ListItemRow` provides that state and `ListItemView` injects it — Vue's
  stand-in for the props context Flow writes for the item's
  `Content slot="bottom"`.
- **Slot wrappers are keyed by slot name** (`createFlowRemoteComponent`). Only
  the slots that have content are in the list, so an appearing slot used to
  shift every wrapper after it: Vue matched them by position, the host
  re-materialised those components, and an element the user was on was replaced.
  Expanding an accordion item did that to its own toggle and dropped the focus
  to `<body>`.
- **A date range is compared in the shared model** (`dateRangeFilterFn` in
  `components-base`), so the two bindings cannot disagree about which rows a
  range covers. It matches a date by shape rather than by class — a
  `CalendarDate`, a luxon `DateTime` and the plain object one becomes after
  crossing the remote boundary all carry the same three numbers — and reads a
  date-only string as the day it spells, which `new Date()` would not.
- **`infiniteScroll` is inert across the remote boundary — in React too.** The
  trigger is an `IntersectionObserver` on the Nth-from-last item
  (`useInfiniteScrollTrigger` in `packages/components`), and in a remote app
  that item is a `flr-items-grid-list-item` in the extension's document, which
  has no layout and never intersects. No prop carries the intent to the host
  either, because `List` is not `@flr-generate`. So this binding leaves it out
  rather than shipping a flag that does nothing; closing it needs a host-side
  signal, which is a change in `packages/components`.
- **Logic shared with React lives in `@mittwald/flow-components-base`**, not
  here — the whole list model and the `Action` state machine: pure MobX, no
  framework, and this package brings only the subscription
  (`src/lib/mobxSelector.ts`, ~15 lines). `src/lib/mobxSelector.test.ts` drives
  that shared state through Vue's reactivity — which is also what keeps a React
  import out of the core, since nothing else would notice one. The package is a
  **devDependency** on purpose: it is private, and `externalizeDeps` leaves
  devDependencies alone, so it is bundled instead of published as a bare import.
  `mobx` has to be a real dependency here for the same reason.
- **`Modal confirmOnClose` carries its own translations.** Flow's four strings
  live in `Modal/locales/*.locale.json`, are compiled into the React bundle by a
  locale plugin, and are not importable from a published package — so
  `src/overlays/Modal.ts` repeats them for `de-DE` and `en-US`. A rewording on
  the Flow side drifts here without failing anything.
- **A composite's class names are asserted in the browser tests**
  (`Overlays.browser.test.ts`), so a rename in `packages/components` fails here
  rather than in an extension.
