# Using Flow Remote from Vue — guide for agents and developers

How to build an **mStudio extension** with
`@mittwald/flow-remote-vue-components`.

> **Experimental.** Published so extensions can be built against it, but without
> a stability promise yet: the API may change while `List` is missing.
> Everything else in this repository follows deprecate-don't-break — this
> package will too, once those gaps are closed and the surface is settled.

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

## The components that are not generated

Flow's overlays, actions and providers are React compositions rather than remote
elements, so this package rebuilds them in Vue. They are imported from the same
place and behave the same way:

`Modal`, `ModalTrigger`, `Popover`, `PopoverTrigger`, `LightBox`,
`LightBoxTrigger`, `Action`, `ActionBatch`, `NotificationProvider`,
`SettingsProvider`, `DeprecationWarningProvider`, `CountryOptions`, `Wrap`,
`BrowserOnly`, `LoadingIndicator`, `Form`.

An overlay opens from its trigger, or from a controller you hold yourself:

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

## What is missing

- **`List`, `ListItemView` and `typedList`.** Flow's list framework has no Vue
  rebuild. Use `Table` or `ItemsGridList` where they fit.
- **`IntlProvider`.** React's sets the locale for what renders locally; a Vue
  app renders nothing locally. `useLanguage()` reports the host's language.
- **The react-hook-form integration.** Use `Form` and read the submitted
  `FormData`, or bring your own Vue form library.

## Composables

| Composable                        | What it gives you                                  |
| --------------------------------- | -------------------------------------------------- |
| `useOverlayController()`          | open, close and toggle an overlay from anywhere    |
| `useModalController()`            | the same thing under Flow's name for it            |
| `useNotificationController()`     | raise and dismiss notifications                    |
| `useRemoteConnection()`           | the connection to the host, once it is established |
| `useLanguage()`                   | the backoffice's language                          |
| `useWarnDeprecation()`            | report a deprecated path you still use             |
| `useSetting(name, default)`       | a value that survives a reload                     |
| `useIsMounted()`, `useOnChange()` | the small React helpers Flow exports               |
| `injectContextIcon(name)`         | the icon a surrounding `IconSetProvider` supplies  |

## Links

- Flow documentation: <https://flow.mittwald.de>
- Remote-UI explainer:
  <https://github.com/mittwald/flow/blob/main/docs/remote-ui.md>
- The React remote package, whose `USAGE.md` covers the boundary itself:
  <https://www.npmjs.com/package/@mittwald/flow-remote-react-components>
