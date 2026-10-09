# @mittwald/flow-remote-vue-components

> **Beta.** Extensions can be built against it, but the API is exempt from
> Flow's breaking-change promise until the beta ends. Everything else in this
> repository follows deprecate-don't-break — this package will too, once every
> gap below is closed or recorded as permanent and the surface has settled
> ([ADR 0007](../../docs/adr/0007-beta-packages.md)).

Vue API for the Flow remote surface — the counterpart of
[`@mittwald/flow-remote-react-components`](../remote-react-components). The
extension runs in a hidden iframe, renders `flr-*` custom elements, and the
mStudio host materializes them as React Flow components. Nothing about that
pipeline is React-specific below the element layer, which is what makes this
package possible.

```shell
pnpm add @mittwald/flow-remote-vue-components @mittwald/flow-react-components @mittwald/ext-bridge vue react react-dom
```

`@mittwald/flow-react-components` is a peer dependency at **runtime and for the
types**:

- **Runtime.** `@mittwald/flow-remote-core` serializes password policies with
  its `mittwald-password-tools-js` entry, which imports `react`. Without it, or
  without `react`, the bundle fails to build. With it,
  `@mittwald/password-tools-js` and its dictionaries land in your bundle.
- **Types.** Every component's props are Flow's React prop types, read from that
  package's declarations.

`@mittwald/ext-bridge` is a peer because `RemoteRoot` imports it. `react` and
`react-dom` are peers of `@mittwald/flow-react-components`, not of this package.
npm and pnpm install peers on their own; `yarn` and `npm --legacy-peer-deps` do
not, so name all of them.

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Button,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";

const count = ref(0);
</script>

<template>
  <Section>
    <Heading>Squadron</Heading>
    <Text>{{ count }} pilots ready</Text>
    <Button color="success" @press="count++">Add a pilot</Button>
  </Section>
</template>
```

The app is wrapped in `RemoteRoot`, which connects to the host:

```ts
import { createApp, h } from "vue";
import { RemoteRoot } from "@mittwald/flow-remote-vue-components";
import App from "./App.vue";

createApp({
  render: () => h(RemoteRoot, null, { default: () => h(App) }),
}).mount("#app");
```

## How it maps to Vue

| Flow / React                     | Vue                                                       |
| -------------------------------- | --------------------------------------------------------- |
| `isDisabled={true}`              | `:is-disabled="true"` or `:isDisabled="true"` — both work |
| `onPress={fn}`                   | `@press="fn"` or `@press-change` for `onPressChange`      |
| `className="…"`                  | `class="…"`                                               |
| `children`                       | the default slot                                          |
| a `ReactNode` prop (`emptyView`) | the named slot `#emptyView`                               |
| `value` plus `onChange`          | `v-model="name"`                                          |
| `isOpen` plus `onOpenChange`     | `v-model:is-open="open"`                                  |

Props keep their Flow names and types: the generated components take their prop
type straight from the remote element class, which takes it from the React
component. So `Button` in Vue accepts exactly what `Button` accepts in React,
minus what cannot cross the boundary.

`v-model` binds any prop Flow makes controllable — the ones with a `default*` or
`isDefault*` sibling — to the event that reports it: `value` and `isSelected` to
`change`, `isOpen` to `openChange`, `selectedKey` to `selectionChange`,
`focusedValue` to `focusChange`. A bare `v-model` takes the first of `value`,
`isSelected`, `selectedKey`, `selectedKeys` the component has, and `.trim` /
`.number` work. A `v-model` with nothing to bind warns. It is the generated
components that take it; `Modal` and the other rebuilt overlays take a
`controller` instead.

An array or object changed in place — `points.value.push(point)` — reaches the
host like a new one does.

## What is generated

`src/auto-generated/**` comes from `packages/components`
(`pnpm nx build:remote-components components`) — one file per `@flr-generate`
component, naming only what the element class cannot tell at runtime: its slot
props and its boolean props.

`src/icons/**` comes from `packages/icons-base`
(`pnpm nx build:icons remote-vue-components`) — Flow's whole icon set as Vue
components, from the same `icons.yaml` the React sets are built from. The Tabler
path data is inlined, so nothing has to install `@tabler/icons-react`.

```vue
<Button>
  <IconDownload />
  Download
</Button>
```

## What is hand-written

Flow's remote surface has a second layer: `flr-universal`, the components that
are React _compositions over_ remote elements rather than remote elements
themselves. They cannot be generated, so this package rebuilds them in Vue:

| Component                                           | The rebuild                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Modal`, `Popover`, `LightBox`                      | render `OverlayContent` / `PopoverContent` with Flow's own classes, and configure their children      |
| `Modal confirmOnClose`                              | a confirmation modal bound to the parent's `isConfirmingClose`, with its own copy of the four strings |
| `IconSetProvider`                                   | provide/inject; its `IconSet` is partial, because there is no complete second set to hand it          |
| `ModalTrigger`, `PopoverTrigger`, `LightBoxTrigger` | a `DialogTrigger` whose `Button` (also inside an `Action`) gets the `onPress` that opens it           |
| `useOverlayController`, `useModalController`        | a `ref` plus `provide`/`inject`; given a type, the surrounding overlay's controller, as in Flow       |
| `Action`, `ActionBatch`                             | run, report pending/succeeded/failed on the button, close the overlay                                 |
| `NotificationProvider`, `useNotificationController` | a reactive list, with the auto-close timer that pauses on hover and focus                             |
| `DeprecationWarningProvider`, `useWarnDeprecation`  | provide/inject; `RemoteRoot` forwards to the host                                                     |
| `SettingsProvider`                                  | React's store format and props: `localStorage` or an async custom store, nested providers             |
| `CountryOptions`                                    | `Option`s from `country-codes-list`, named by `Intl.DisplayNames`                                     |
| `Wrap`, `BrowserOnly`                               | the same two-line components                                                                          |
| `List`, `ListItemView`                              | the arrangement around `@mittwald/flow-components-base`, plus the batch loading                       |
| `useIsMounted`, `useOnChange`, `useLanguage`        | composables                                                                                           |
| `useListMetadata`                                   | what the list's loader sent beside its data                                                           |
| `Form`                                              | `flr-form` has no Flow component behind it, so the generator never sees it                            |

Where Flow uses a `PropsContext` to configure the components inside a composite,
these use `cloneVNode` on the children the composite was handed (`mapChildren`
in `src/overlays/childProps.ts`). It reaches one level, not the whole subtree —
a rule for a grandchild costs an explicit nested rule (`applyChildRules`), which
is what tells the `Action`s in a modal's footer not to ask for confirmation.

## Known gaps

- **The `List` is rebuilt, but not all of it.** Everything it _decides_ — the
  batches, the filters, the sorting, the search, the view mode and the TanStack
  table itself — lives in `@mittwald/flow-components-base` and is the same code
  React runs. What is written here is the arrangement plus the one job the
  shared model deliberately leaves open: fetching a batch. Selection, expandable
  items, date-range filters and both loaders are there — `ListLoaderAsync` for a
  promise, `ListLoaderComposable` for anything that has to run in a `setup()` —
  as is `useListMetadata()`. The list follows what the app changes — a filter's
  `values`, the data, a loader's `dependencies` — as React's does by rebuilding
  it on every render. What is not there:
  - `typedList` — Vue infers the item type from the `ListItem` slot
  - the list's `onChange` and `settingsStorageDefaults`
  - a custom `render` for the search, and the search field's props beyond
    `autoSubmit` and `autoFocus`
  - an item's `loadingView`

  `settingStorageKey`, `getItemId`, `batchSize` and `defaultViewMode` are read
  when the list is built; to change them, give the `List` a new `key`.

- **There is no `infiniteScroll` prop, because it cannot work remotely.** Flow
  attaches an `IntersectionObserver` to the Nth-from-last list item
  (`useInfiniteScrollTrigger`), and in a remote app that item is a
  `flr-items-grid-list-item` in the extension's own document — which has no
  layout and is never on screen. Nothing carries the intent to the host either:
  `List` is not `@flr-generate`, so no `infiniteScroll` prop crosses. The React
  binding has the same hole; it is inert there too, silently. Loading the next
  batch from a scroll position needs a host-side signal. **This gap is
  permanent** in the sense of
  [ADR 0007 §3](../../docs/adr/0007-beta-packages.md#3-how-the-beta-ends): no
  API change in this package can close it, so it does not hold the beta open.
  The view settings _are_ persisted, through `settingStorageKey` and a
  surrounding `SettingsProvider`, in the format React writes.
- **`Action` runs, reports and closes.** An `onAction` drives the pending,
  succeeded and failed states, and `closeModal` / `closeOverlay` closes the
  overlay the action sits in. What it has not got is the `actionConfirm` modal
  and a target named by component (`closeOverlay="CoachMark"`), which is why the
  `coach-mark` demo has no Vue counterpart.
- **No pro icon set.** `@mittwald/flow-icons-pro` renders FontAwesome Pro, which
  each consumer licenses itself and which therefore cannot be inlined the way
  Tabler's is. `IconSetProvider` is what fills the gap: hand it your own icons
  and Flow's components use them. An icon outside Flow's set still goes in as a
  raw `<svg>` inside `Icon`.
- **No `IntlProvider`.** React's sets react-aria's locale for what renders
  locally; a Vue app renders nothing locally. `useLanguage()` reports the host's
  language instead.
- **No `ComponentDefaultsProvider`.** Both of its settings belong to something
  this binding does not have: `List.disableInitialSuspenseBoundary` to React's
  Suspense, `Form.confirmModalCloseOnUnsavedChanges` to the react-hook-form
  integration.
- **The rebuilt compositions repeat Flow's internal class names**
  (`flow--modal`, `flow--popover`, …). They are how the host is asked to render
  a modal rather than a bare dialog; `flow/no-unknown-flow-class` fails lint on
  one Flow no longer generates. Making `Modal` and friends `@flr-generate` would
  remove both the class names and most of this layer.
- **The rebuilds carry their own copy of Flow's UI text.** Flow's strings are
  compiled into the React bundle and are not importable, so this package repeats
  the `List`'s texts, the four `confirmOnClose` strings and the `LightBox` close
  label in `de-DE` and `en-US`. `src/tests/CopiedTexts.test.ts` compares them
  with Flow's locale files, so a rewording fails the unit tests.
- **No SFC build.** The package ships plain TypeScript; a consumer's own build
  handles `.vue` files.

## Tests

- `pnpm nx test:unit remote-vue-components` — the controllers, the vnode
  helpers, and the UI text copied from Flow.
- `pnpm nx test:browser remote-vue-components --browser.name=webkit` — a Vue
  tree, the production serializer, and React's `RemoteRenderer` as the host.
- `pnpm nx test:parity remote-vue-components` — two harnesses, one target.
  - `e2e/react-parity`: the React package's whole visual corpus, rendered once
    from React and once from Vue, asserting the host builds the same DOM,
    overlays included. Every scenario is compared, and all of them match, except
    those `e2e/react-parity/knownGaps.ts` lists with a reason.
  - `e2e/list-parity`: the `List`, which the corpus cannot express — its
    scenarios build one with `typedList<T>()` and a React component of their
    own. So it is written once per binding and compared the same way, including
    what the host portals out of the list (a menu, the all-filters modal). A
    final check asserts the scenarios reached every component, so the suite
    cannot stay green on a shrinking surface.

  The second one is **not React-versus-Vue**: it iterates a list of bindings,
  the first of which is the reference. A third framework is a file next to
  `harness/bindings/vue.ts` and one key per scenario.
