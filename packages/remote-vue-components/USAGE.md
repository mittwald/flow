# Using Flow Remote from Vue — guide for agents and developers

How to build an **mStudio extension** with
`@mittwald/flow-remote-vue-components`.

> **Beta.** Extensions can be built against it, but the API is exempt from
> Flow's breaking-change promise until the beta ends. Everything else in this
> repository follows deprecate-don't-break — this package will too, once the
> gaps below are closed and the surface is settled.

This package's components are generated from
[`@mittwald/flow-react-components`](https://www.npmjs.com/package/@mittwald/flow-react-components)
and have the same names and props. **Read that package's `USAGE.md` first** —
component selection, layout and spacing, what is safe to depend on, and where
the documentation lives. It applies here unchanged.

Its remote counterpart,
[`@mittwald/flow-remote-react-components`](https://www.npmjs.com/package/@mittwald/flow-remote-react-components),
documents what changes because your UI renders across a process boundary — which
components exist remotely, which props do not cross, what survives
serialization. **That applies here unchanged too**: both packages drive the same
`flr-*` elements.

What follows is only what is different because you write Vue.

## The model

Your extension runs in a hidden iframe. It does not render DOM — it builds a
tree of `flr-*` elements that is serialized to the mStudio host, which
materializes it with the real Flow components. You write ordinary Vue; the
boundary is invisible until you hit one of the limits the React package
documents.

```
your extension (iframe)                    mStudio (host)
RemoteRoot + these components  ─────────►  real Flow components
```

`RemoteRoot` is the entry point. It connects to the host's render root and
initializes the extension bridge:

```ts
import { createApp, h } from "vue";
import { RemoteRoot } from "@mittwald/flow-remote-vue-components";
import App from "./App.vue";

createApp({
  render: () => h(RemoteRoot, null, { default: () => h(App) }),
}).mount("#app");
```

The full explainer:
<https://github.com/mittwald/flow/blob/main/docs/remote-ui.md>.

## Writing components

Props keep their Flow names. Events keep their Flow names too, minus `on`:

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Button,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";

const pilots = ref(0);
</script>

<template>
  <Section>
    <Heading>Squadron</Heading>
    <Text>{{ pilots }} pilots ready</Text>
    <Button color="success" @press="pilots++">Add a pilot</Button>
  </Section>
</template>
```

| Flow / React                     | Vue                                                |
| -------------------------------- | -------------------------------------------------- |
| `isDisabled={true}`              | `:is-disabled="true"` or `:isDisabled="true"`      |
| `onPress={fn}`                   | `@press="fn"`, `@press-change` for `onPressChange` |
| `className="…"`                  | `class="…"`                                        |
| `children`                       | the default slot                                   |
| a `ReactNode` prop (`emptyView`) | the named slot `#emptyView`                        |
| `value` plus `onChange`          | `v-model="name"`                                   |
| `isOpen` plus `onOpenChange`     | `v-model:is-open="open"`                           |

`v-model` works on every prop Flow makes controllable — the ones with a
`default*` sibling (`value`/`defaultValue`, `isOpen`/`defaultOpen`). A bare
`v-model` binds `value`, or `isSelected` on a checkbox or a switch, or
`selectedKey`; a named one binds the prop it names. `.trim` and `.number` apply.
A `v-model` the component has nothing for warns in the console.

```vue
<TextField v-model.trim="name"><Label>Name</Label></TextField>
<Checkbox v-model="accepted">Accept the terms</Checkbox>
```

Change data the way Vue does — in place is fine. `points.value.push(point)`
reaches a chart just as a new array does.

A prop typed `ReactNode` in Flow is a **slot** here, not a prop — rendered
output does not survive the boundary as data:

```vue
<CartesianChart :data="data" height="300px">
  <template #emptyView>
    <IllustratedMessage>
      <Heading>No data available</Heading>
    </IllustratedMessage>
  </template>
  <Area data-key="Shields" />
</CartesianChart>
```

## Icons

Flow's icons are Vue components here, under the same names as in React:

```vue
<Button>
  <IconDownload />
  Download
</Button>
```

They take Flow's `Icon` props (`size`, `color`, `aria-label`) and come from the
same package as everything else.

For an icon that is **not** in Flow's set — including anything from
`@mittwald/flow-icons-pro`, which renders FontAwesome Pro and has no Vue build —
put the SVG inside `Icon` yourself. Plain elements travel through the remote
tree like any other node, and `Icon` gives them Flow's sizing and colour:

```vue
<Icon>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M10 3a7 7 0 1 0 0 14a7 7 0 0 0 0 -14" />
    <path d="M21 21l-6 -6" />
  </svg>
</Icon>
```

To replace Flow's icons everywhere instead of one at a time, wrap the app in
`IconSetProvider`. Each entry is a component rendering an `<svg>`, and Flow's
`Icon` still supplies the sizing, the colour and the ARIA around it:

```vue
<IconSetProvider :set="{ Close: MyCloseIcon, Delete: MyDeleteIcon }">
  <App />
</IconSetProvider>
```

The set is partial: an icon you leave out keeps Flow's. This is the component to
reach for if you license FontAwesome Pro — `@mittwald/flow-icons-pro` is React
only, so there is nothing to import, but your own build of it goes here.

## Writing JSX instead of templates

Every component here is a plain Vue component, so JSX works — set
`jsxImportSource` and write the tree the way the React examples do:

```tsx
/** @jsxImportSource vue */
<Section>
  <Heading>Fleet</Heading>
  <Button onPress={launch}>Launch</Button>
</Section>
```

Named and scoped slots are an object child:
`<List>{{ default: ({ data }) => … }}</List>`.

Two rough edges are Vue's, not this package's. `vue/jsx-runtime` hands a
component its children as a value rather than as a slot function, so Vue warns
"Non-function value encountered for default slot" once per element. A runtime of
your own that wraps them silences it. The slot has to build fresh vnodes on
every call rather than return the ones JSX built: a component calls its slot on
every render of its own, and Vue mounts a vnode in place, so handing it the same
nodes twice loses state (a date-range popover closed between two clicks):

```ts
import { cloneVNode, h, isVNode, type VNode } from "vue";

const freshCopy = (children: unknown): unknown => {
  if (Array.isArray(children)) return children.map(freshCopy);
  if (!isVNode(children)) return children;
  const copy = cloneVNode(children);
  if (Array.isArray(copy.children)) {
    copy.children = copy.children.map(freshCopy) as VNode[];
  }
  return copy;
};

// inside jsx(), for a component's default slot:
return h(type, attributes, { default: () => freshCopy(children) });
```

And Vue's JSX namespace has no `ElementChildrenAttribute`, so TypeScript checks
children against the props; declaring `children?: unknown` on
`JSX.IntrinsicAttributes` is the fix.
`apps/remote-dom-demo/src/app/remote-vue/_lib/jsx-runtime.ts` in the Flow
repository is both, in one file.

## The components that are not generated

Flow's overlays, actions and providers are React compositions rather than remote
elements, so this package rebuilds them in Vue. They are imported from the same
place and behave the same way:

`Modal`, `ModalTrigger`, `Popover`, `PopoverTrigger`, `LightBox`,
`LightBoxTrigger`, `Action`, `ActionBatch`, `NotificationProvider`,
`SettingsProvider`, `DeprecationWarningProvider`, `CountryOptions`, `Wrap`,
`BrowserOnly`, `LoadingIndicator`, `Form`.

An overlay opens from its trigger, or from a controller you hold yourself.
`useModalController()` inside a modal hands back that modal's controller, as in
Flow; `useOverlayController()` without a type always makes a new one. And
`controller.close()` asks first on a `confirm-on-close` modal —
`close({ bypassConfirmation: true })` does not:

```vue
<script setup lang="ts">
import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
} from "@mittwald/flow-remote-vue-components";
</script>

<template>
  <ModalTrigger>
    <Button>New squadron</Button>
    <Modal>
      <Heading>New squadron</Heading>
      <Content>Rally your pilots.</Content>
      <ActionGroup>
        <Action close-modal>
          <Button color="success">Create</Button>
        </Action>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
</template>
```

Two differences from the React versions are worth knowing:

- **A composite reaches its own children, not the whole subtree.** Flow uses a
  React context to configure the components inside a `Modal` or an `Action`;
  there is no equivalent here, so a `Heading` nested one component deeper than
  the `Modal` expects is left unconfigured. Keep them direct children.
- **`Action` runs, reports and closes.** It has no batching model and no
  confirmation modal of its own (Flow's `slot="actionConfirm"`): an `onAction`
  drives the button's pending, succeeded and failed states, and `close-modal`
  closes the surrounding overlay.

A modal can still protect unsaved changes, the same way React's does:

```vue
<Modal confirm-on-close>
  <Heading>New squadron</Heading>
  <Content>
    <TextField is-required><Label>Squadron name</Label></TextField>
  </Content>
  <ActionGroup>
    <Action close-modal><Button color="success">Create</Button></Action>
  </ActionGroup>
</Modal>
```

Escape, a click outside and any `Action close-modal` in the body then ask first.
The actions in the `ActionGroup` do not — the footer is the deliberate way out,
which is the rule Flow's props context writes as well.

## The list

`List` is here, and it is configured by the elements inside it — the same shape
Flow's React list has. They render nothing; they describe the list.

```vue
<script setup lang="ts">
import {
  Heading,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListSearch,
  ListStaticData,
} from "@mittwald/flow-remote-vue-components";

const crew = [{ name: "Ellen Ripley", rank: "Warrant Officer" }];
</script>

<template>
  <List aria-label="Crew" setting-storage-key="crew" accordion>
    <ListStaticData :data="crew" />
    <ListSearch auto-submit />
    <ListFilter property="rank" name="Rank" mode="some" />
    <ListItem v-slot="{ data }" :text-value="(d) => d.name">
      <ListItemView>
        <Heading>{{ data.name }}</Heading>
      </ListItemView>
    </ListItem>
  </List>
</template>
```

The item type comes from the data: there is no `typedList`, because the slot
already carries it.

`setting-storage-key` persists the view settings — the sorting, the filters, the
view mode, the search — but only inside a `SettingsProvider`, as in React. It
takes React's props and writes React's format, so a list reads what the React
binding stored under the same keys:

```vue
<SettingsProvider type="localStorage" storage-key="squadron-settings">
  <List aria-label="Crew" setting-storage-key="crew">…</List>
</SettingsProvider>
```

`type="custom"` takes a `store` with an async `load()` and `store(settings)`
instead. The children render once the settings are loaded, and a new `id` loads
them again — from the backend the props name at that point.

**Loading takes one of two elements.** `ListLoaderAsync` takes a function that
returns a promise:

```vue
<ListLoaderAsync :loader="loadCrew" manual-pagination />
```

```ts
const loadCrew = async (options) => {
  const response = await api.getCrew({
    limit: options.pagination?.limit,
    skip: options.pagination?.offset,
  });

  return { data: response.items, itemTotalCount: response.total };
};
```

`ListLoaderComposable` takes a **composable** — anything that has to run in a
`setup()`, which a query library's `useQuery` does:

```vue
<ListLoaderComposable :loader="useCrew" manual-filtering />
```

```ts
import type { ListComposableDataLoader } from "@mittwald/flow-remote-vue-components";

const useCrew: ListComposableDataLoader<CrewMember> = (options) => {
  const result = ref<{ data: CrewMember[]; itemTotalCount: number }>();

  /* Re-runs whenever a filter, the sorting or the search changes. */
  watchEffect(async () => {
    const response = await api.getCrew(options());
    result.value = { data: response.items, itemTotalCount: response.total };
  });

  return result;
};
```

`options` is a **getter**, not a value: the composable is called once per batch,
and reading it inside a `computed`, a `watch` or a query key is what makes a
changed filter reach the source. Return a result, a ref or a getter; `undefined`
keeps the batch loading.

The three flags — `manual-pagination`, `manual-filtering`, `manual-sorting` —
say which of those jobs the source does itself. What it is not told, it must not
do: a source that paginates but is sent no pagination returns its first page
forever.

An async loader that reads something besides the query — a route parameter, a
selected project — names it in `dependencies`, and a change loads every batch
again, as in React:

```vue
<ListLoaderAsync :loader="loadCrew" :dependencies="[projectId]" />
```

`useListMetadata<T>()` reads back whatever the loader sent beside its data.

The list follows its children: a filter whose `values` arrive later, a changed
sorting name, new data. `setting-storage-key`, `get-item-id`, `batch-size` and
`default-view-mode` are read when the list is built — give the `List` a new
`key` to change them.

**The table view's elements are flat, not nested.** React writes
`<List.Table><List.TableHeader><List.TableColumn>`; here the columns and cells
are direct children of the `List`, because the list reads its own children and
does not walk into another component's slot. `ListTable`, `ListTableHeader`,
`ListTableBody` and `ListTableRow` are there for their props, and a `ListTable`
with no columns beside it throws rather than rendering a table view with nothing
in it.

```vue
<List aria-label="Crew" default-view-mode="table">
  <ListStaticData :data="crew" />
  <ListTableColumn>Name</ListTableColumn>
  <ListTableColumn>Rank</ListTableColumn>
  <ListTableCell v-slot="{ data }">{{ data.name }}</ListTableCell>
  <ListTableCell v-slot="{ data }">{{ data.rank }}</ListTableCell>
</List>
```

## What is missing

- **`typedList`, the list's `onChange`, and `infiniteScroll`.** The first has no
  purpose here (the `ListItem` slot carries the item type); the last cannot work
  across the boundary, in React either — the observer it needs watches an
  element that lives in your iframe and is never on screen.
- **Some of the list's finer props:** `settingsStorageDefaults`, a custom
  `render` for `ListSearch` and the search field's props beyond `auto-submit`
  and `auto-focus`, and an item's `loadingView`.
- **`IntlProvider`.** React's sets the locale for what renders locally; a Vue
  app renders nothing locally. `useLanguage()` reports the host's language.
- **The react-hook-form integration.** Use `Form` and read the submitted
  `FormData`, or bring your own Vue form library.

## Composables

| Composable                        | What it gives you                                  |
| --------------------------------- | -------------------------------------------------- |
| `useOverlayController(type?)`     | open, close and toggle an overlay from anywhere    |
| `useModalController()`            | the surrounding modal's controller, or a new one   |
| `useNotificationController()`     | raise and dismiss notifications                    |
| `useRemoteConnection()`           | the connection to the host, once it is established |
| `useLanguage()`                   | the backoffice's language                          |
| `useWarnDeprecation()`            | report a deprecated path you still use             |
| `useIsMounted()`, `useOnChange()` | the small React helpers Flow exports               |
| `injectContextIcon(name)`         | the icon a surrounding `IconSetProvider` supplies  |
| `useListMetadata()`               | what a list's loader sent beside its data          |

## Links

- Flow documentation: <https://flow.mittwald.de>
- Remote-UI explainer:
  <https://github.com/mittwald/flow/blob/main/docs/remote-ui.md>
- The React remote package, whose `USAGE.md` covers the boundary itself:
  <https://www.npmjs.com/package/@mittwald/flow-remote-react-components>
