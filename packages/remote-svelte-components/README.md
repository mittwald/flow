# @mittwald/flow-remote-svelte-components

> **Prototype.** Not published, not part of the release line. It exists to
> answer one question: can an mStudio extension be written in Svelte and still
> render real Flow components in the host?

Svelte API for the Flow remote surface — the counterpart of
[`@mittwald/flow-remote-react-components`](../remote-react-components). The
extension runs in a hidden iframe, renders `flr-*` custom elements, and the
mStudio host materializes them as React Flow components. Nothing about that
pipeline is React-specific below the element layer, which is what makes this
package possible.

```svelte
<script lang="ts">
  import {
    Button,
    Heading,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";

  let count = $state(0);
</script>

<Section>
  <Heading>Squadron</Heading>
  <Text>{count} pilots ready</Text>
  <Button color="success" onPress={() => count++}>Add a pilot</Button>
</Section>
```

The app is wrapped in `RemoteRoot`, which connects to the host:

```svelte
<script lang="ts">
  import { RemoteRoot } from "@mittwald/flow-remote-svelte-components";
  import App from "./App.svelte";
</script>

<RemoteRoot><App /></RemoteRoot>
```

## How it maps to Svelte

| Flow / React                     | Svelte                          |
| -------------------------------- | ------------------------------- |
| `isDisabled={true}`              | `isDisabled={true}` — unchanged |
| `onPress={fn}`                   | `onPress={fn}` — unchanged      |
| `className="…"`                  | `class="…"`                     |
| `children`                       | the default content             |
| a `ReactNode` prop (`emptyView`) | a snippet named `emptyView`     |

Props keep their Flow names and types: the generated components take their prop
type straight from the remote element class, which takes it from the React
component. So `Button` in Svelte accepts exactly what `Button` accepts in React,
minus what cannot cross the boundary.

A snippet for a slot prop is written the way Svelte writes any snippet:

```svelte
<CartesianChart data={pilots}>
  {#snippet emptyView()}<Text>No pilots yet</Text>{/snippet}
</CartesianChart>
```

## What is generated

`src/auto-generated/**` comes from `packages/components`
(`pnpm nx build:remote-components components`) — one `.svelte` component per
`@flr-generate` component, 134 of them, plus an `index.ts` that re-exports each
one together with its props type.

## What is hand-written

Flow's remote surface has a second layer: `flr-universal`, the components that
are React _compositions over_ remote elements rather than remote elements
themselves. They cannot be generated, so this package rebuilds them in Svelte:

| Component                                           | The rebuild                                                                                        |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Modal`, `Popover`, `LightBox`                      | render `OverlayContent` / `PopoverContent` with Flow's own classes, and configure their children   |
| `ModalTrigger`, `PopoverTrigger`, `LightBoxTrigger` | one component under three names: a `DialogTrigger` whose `Button` gets the `onPress` that opens it |
| `useOverlayController`                              | a class with a `$state` field, shared through context, instead of a MobX model in React context    |
| `Action`, `ActionBatch`                             | run, report pending/succeeded/failed on the button, close the overlay                              |
| `NotificationProvider`, `useNotificationController` | a reactive list, with the auto-close timer that pauses on hover and focus                          |
| `DeprecationWarningProvider`, `useWarnDeprecation`  | context; `RemoteRoot` forwards to the host                                                         |
| `SettingsProvider`, `useSetting`                    | a persisted rune box, `localStorage` by default                                                    |
| `CountryOptions`                                    | `Option`s from `country-codes-list`, named by `Intl.DisplayNames`                                  |
| `Wrap`, `BrowserOnly`                               | the same two-line components — `Wrap` with a snippet signature, see below                          |
| `useLanguage`, `useRemoteConnection`                | context accessors returning a reactive box                                                         |
| `Form`                                              | `flr-form` has no Flow component behind it, so the generator never sees it                         |

Where Flow uses a `PropsContext` to configure the components inside a composite,
so does this package — `setContext`/`getContext` is the same mechanism React's
context is, so it reaches the whole subtree, and every generated component
clears it for its own children the way Flow's UI components do.

`Wrap` is the one component whose signature had to change. A snippet cannot be
looked inside, so the wrapper is passed as one that receives the content:

```svelte
<Wrap if={isLink} with={link}>Squadron</Wrap>
{#snippet link(content)}
  <Link href="/squadron">{@render content()}</Link>
{/snippet}
```

## Known gaps

- **`List`, `ListItemView` and `typedList` are not rebuilt.** 5,500 lines of
  data sources, filters, sorting, pagination and persisted view settings — its
  own project, not a prototype step.
- **No icon set.** Flow's icons are React components. A Svelte app can put a raw
  `<svg>` inside `Icon`, which travels as remote DOM, but there is no
  `@mittwald/flow-icons` for Svelte.
- **No `IntlProvider`.** React's sets react-aria's locale for what renders
  locally; a Svelte app renders nothing locally. `useLanguage()` reports the
  host's language instead.
- **The rebuilt compositions repeat Flow's internal class names**
  (`flow--modal`, `flow--popover`, …). They are how the host is asked to render
  a modal rather than a bare dialog. Making `Modal` and friends `@flr-generate`
  would remove both the class names and most of this layer.
- **`packageVersion` is `0.0.0` in a published build.** `svelte-package` has no
  step that injects it — see `src/version.ts`. Only the reported diagnostics are
  affected; the protocol version is separate.

## Trying it

`pnpm nx dev remote-dom-demo` and open any `/host/…` page: every demo has a
React/Svelte switch, and the Svelte side serves twenty of them
(`apps/remote-dom-demo/src/app/remote-svelte`). The rest say so themselves —
they need Flow's `List`, react-hook-form, a Next server action or a Flow icon
set.

## Tests

- `pnpm nx test:unit remote-svelte-components` — the controllers and the
  settings store.
- `pnpm nx test:browser remote-svelte-components --browser.name=webkit` — a
  Svelte tree, the production serializer, and React's `RemoteRenderer` as the
  host.
