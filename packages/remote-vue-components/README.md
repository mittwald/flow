# @mittwald/flow-remote-vue-components

> **Experimental.** Published so extensions can be built against it, but without
> a stability promise yet: the API may still change. Everything else in this
> repository follows deprecate-don't-break — this package will too, once the
> remaining gaps below are closed and the surface is settled.

Vue API for the Flow remote surface — the counterpart of
[`@mittwald/flow-remote-react-components`](../remote-react-components). The
extension runs in a hidden iframe, renders `flr-*` custom elements, and the
mStudio host materializes them as React Flow components. Nothing about that
pipeline is React-specific below the element layer, which is what makes this
package possible.

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

Props keep their Flow names and types: the generated components take their prop
type straight from the remote element class, which takes it from the React
component. So `Button` in Vue accepts exactly what `Button` accepts in React,
minus what cannot cross the boundary.

## What is generated

`src/auto-generated/**` comes from `packages/components`
(`pnpm nx build:remote-components components`) — one line per `@flr-generate`
component, 134 of them.

`src/icons/**` comes from `packages/icons-base`
(`pnpm nx build:icons remote-vue-components`) — Flow's 132 icons as Vue
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
| `ModalTrigger`, `PopoverTrigger`, `LightBoxTrigger` | a `DialogTrigger` whose non-overlay child gets the `onPress` that opens it                            |
| `useOverlayController`                              | a `ref` plus `provide`/`inject`, instead of a MobX model in React context                             |
| `Action`, `ActionBatch`                             | run, report pending/succeeded/failed on the button, close the overlay                                 |
| `NotificationProvider`, `useNotificationController` | a reactive list, with the auto-close timer that pauses on hover and focus                             |
| `DeprecationWarningProvider`, `useWarnDeprecation`  | provide/inject; `RemoteRoot` forwards to the host                                                     |
| `SettingsProvider`, `useSetting`                    | a persisted `ref`, `localStorage` by default                                                          |
| `CountryOptions`                                    | `Option`s from `country-codes-list`, named by `Intl.DisplayNames`                                     |
| `Wrap`, `BrowserOnly`                               | the same two-line components                                                                          |
| `List`, `ListItemView`                              | the arrangement around `@mittwald/flow-components-base`, plus the batch loading                       |
| `useIsMounted`, `useOnChange`, `useLanguage`        | composables                                                                                           |
| `Form`                                              | `flr-form` has no Flow component behind it, so the generator never sees it                            |

Where Flow uses a `PropsContext` to configure the components inside a composite,
these use `cloneVNode` on the children the composite was handed (`mapChildren`
in `src/overlays/childProps.ts`). It reaches one level, not the whole subtree —
a rule for a grandchild costs an explicit `mapSlottedChildren`, which is what
tells the `Action`s in a modal's footer not to ask for confirmation.

## Known gaps

- **The `List` is rebuilt, but not all of it.** Everything it _decides_ — the
  batches, the filters, the sorting, the search, the view mode and the TanStack
  table itself — lives in `@mittwald/flow-components-base` and is the same code
  React runs. What is written here is the arrangement plus the one job the
  shared model deliberately leaves open: fetching a batch. Still missing is the
  **"all filters" modal** — the mobile path to the same filters, sortings and
  view modes the header offers on desktop. `typedList` has no counterpart: Vue
  infers the item type from the `ListItem` slot instead.
- **There is no `infiniteScroll` prop, because it cannot work remotely.** Flow
  attaches an `IntersectionObserver` to the Nth-from-last list item
  (`useInfiniteScrollTrigger`), and in a remote app that item is a
  `flr-items-grid-list-item` in the extension's own document — which has no
  layout and is never on screen. Nothing carries the intent to the host either:
  `List` is not `@flr-generate`, so no `infiniteScroll` prop crosses. The React
  binding has the same hole; it is inert there too, silently. Loading the next
  batch from a scroll position needs a host-side signal. The view settings _are_
  persisted, through `settingStorageKey` and a surrounding `SettingsProvider`,
  under the same keys React writes.
- **No pro icon set.** `@mittwald/flow-icons-pro` renders FontAwesome Pro, which
  each consumer licenses itself and which therefore cannot be inlined the way
  Tabler's is. `IconSetProvider` is what fills the gap: hand it your own icons
  and Flow's components use them. An icon outside Flow's set still goes in as a
  raw `<svg>` inside `Icon`.
- **No `IntlProvider`.** React's sets react-aria's locale for what renders
  locally; a Vue app renders nothing locally. `useLanguage()` reports the host's
  language instead.
- **The rebuilt compositions repeat Flow's internal class names**
  (`flow--modal`, `flow--popover`, …). They are how the host is asked to render
  a modal rather than a bare dialog. Making `Modal` and friends `@flr-generate`
  would remove both the class names and most of this layer.
- **`confirmOnClose` carries its own translations.** Flow's four strings are
  compiled into the React bundle and are not importable, so `Modal` repeats them
  in `de-DE` and `en-US`. A rewording on the Flow side drifts here silently.
- **No SFC build.** The package ships plain TypeScript; a consumer's own build
  handles `.vue` files.

## Tests

- `pnpm nx test:unit remote-vue-components` — the controllers and the vnode
  helpers.
- `pnpm nx test:browser remote-vue-components --browser.name=webkit` — a Vue
  tree, the production serializer, and React's `RemoteRenderer` as the host.
- `pnpm nx test:parity remote-vue-components` — the React package's whole visual
  corpus, rendered once from React and once from Vue, asserting the host builds
  the same DOM. 171 of 187 scenarios are compared, and all of them match;
  `e2e/react-parity/knownGaps.ts` lists the rest with a reason.
