# Using Flow Remote — guide for agents and developers

How to build an **mStudio extension** with
`@mittwald/flow-remote-react-components`.

This package's components are generated from
[`@mittwald/flow-react-components`](https://www.npmjs.com/package/@mittwald/flow-react-components)
and have the same names, props and composition rules. **Read that package's
`USAGE.md` first** — component selection, layout and spacing, what is safe to
depend on, and where the documentation lives. It applies here unchanged; nothing
below repeats it.

What follows is only what is different because your UI renders across a process
boundary.

## The model

Your extension runs in a hidden iframe. It does not render DOM — it builds a
tree of `flr-*` elements that is serialized to the mStudio host, which
materializes it with the real Flow components. You write ordinary React; the
boundary is invisible until you hit one of the limits below.

```
your extension (iframe)                    mStudio (host)
RemoteRoot + these components  ─────────►  real Flow components
```

`RemoteRoot` is the entry point. It connects to the host's render root and
initializes the extension bridge:

```tsx
import { RemoteRoot } from "@mittwald/flow-remote-react-components/RemoteRoot";
```

The full explainer:
<https://github.com/mittwald/flow/blob/main/docs/remote-ui.md>.

## Not every component exists remotely

**114 of Flow's 124 public components are available here.** The
[component index](https://www.npmjs.com/package/@mittwald/flow-react-components)
(`@mittwald/flow-react-components/component-index`) records this per component:

```jsonc
{
  "Button": {
    "remote": { "available": true, "excludedProps": ["style", "wrapWith"] },
  },
}
```

Check `remote.available` before reaching for a component. These ten have no
remote counterpart:

`Activity`, `ComponentDefaultsProvider`, `FormAction`, `FormRootError`,
`FormSettingsProvider`, `LinkProvider`, `Overlay`, `OverlayTrigger`,
`RouterProvider`, `SuspenseTrigger`

Three components move to a different address: `Field`, `ResetButton` and
`SubmitButton` come from
`@mittwald/flow-remote-react-components/react-hook-form` here, not from the root
barrel. `Form` lives in the root barrel and is hand-written for the remote side
— it is not the same implementation as the local one.

## Not every prop crosses

Some props are dropped at the boundary, either because they cannot be serialized
or because they would let the extension do too much on the host.
`remote.excludedProps` in the component index lists what a given component
loses. Measured across all remote components:

| Prop         | Affected components |
| ------------ | ------------------- |
| `wrapWith`   | 76                  |
| `style`      | 38                  |
| `controller` | 8                   |

Plus a handful of one-offs (`components`, `componentProps`, `providerId`,
`ref`).

- **No `style`.** There is no inline-style escape hatch here. Layout comes from
  `Flex`, `Section` and `ColumnLayout` — the same rule as locally, but without a
  way around it.
- **No `wrapWith`.** Compose instead.
- **`className` does cross** (70 components keep it). It is the same escape
  hatch as locally, and the same advice applies: reaching for it usually means a
  Flow component already covers the case.
- **`children` cross as element children**, not as a prop, so composition works
  exactly as usual.

## What survives serialization

Props are serialized with `FlowThreadSerialization`
([remote-core](https://github.com/mittwald/flow/blob/main/packages/remote-core/src/serialization/FlowThreadSerialization.ts)).
Worth knowing before you design a prop payload:

- **Functions cross** as proxies, but **their return value does not come back
  synchronously.** Calling a proxy is a round trip, so the host receives a
  Promise. Event handlers are unaffected — nothing reads what they return. A
  formatter or predicate only works where the component awaits it:
  `ChartTooltip`'s formatters may return `Promise<string> | string`, while
  `XAxis`/`YAxis` `tickFormatter` is excluded from the remote surface entirely.
  Format the values in your `data` instead.
- **`Date`, `File`, `FileList`, `FormData`** and dragged text have dedicated
  serializers and arrive intact. So do `Map`, `Set` and arrays.
- **`HTMLElement` and `window` are dropped to `null`.** There is no DOM to hand
  over.
- **Plain objects are shallow-copied.** A class instance therefore arrives as a
  plain object **without its methods** — pass data, not behaviour-carrying
  objects.

## Props are a contract

Your extension is compiled against one version of this package but runs against
whatever Flow version the mStudio host has deployed — the two are released
independently. The connection protocol is versioned and the host handles older
remote versions on purpose, because extensions in the wild keep connecting with
the version they shipped with.

Two consequences:

- **Props of these components are treated as a contract.** They are not broken;
  a superseded prop keeps working and warns at runtime through
  `DeprecationWarningProvider`. That is why upgrading rarely breaks you.
- **The reverse is not guaranteed.** A prop added in a Flow version newer than
  the host's is not something the host knows about. Do not assume a brand-new
  prop takes effect immediately after you bump the dependency.

Read the
[migration notes](https://github.com/mittwald/flow/blob/main/packages/components/MIGRATION.md)
before upgrading — they cover the remote elements too. The codemods among them
run from one command, and it treats this package like any other Flow dependency:

```shell
npx @mittwald/flow-codemods@latest upgrade
```

## Mistakes to avoid

Beyond the ones in the components package's `USAGE.md`:

- Do not import from `@mittwald/flow-react-components` in extension code — those
  are the host-side components and will not render. Import from this package.
- Do not reach for the DOM. There is no document to query, no element to
  measure, no portal target — `HTMLElement` and `window` are dropped at the
  boundary.
- Do not assume a component exists remotely because it exists locally. Check
  `remote.available`.
- Do not pass class instances and expect their methods to arrive. Pass data.

## Links

- Flow documentation — <https://flow.mittwald.de> (machine-readable at
  `/llms.txt`, `/llms.json`, `/raw/<path>.md`; written in German)
- mStudio extension development — <https://developer.mittwald.de>
- Remote-UI explainer —
  <https://github.com/mittwald/flow/blob/main/docs/remote-ui.md>
- Source and issues — <https://github.com/mittwald/flow>
