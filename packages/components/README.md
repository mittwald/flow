# @mittwald/flow-react-components

The React component library of [Flow](https://flow.mittwald.de), the design
system of [mittwald](https://www.mittwald.de). Accessible, brand-aligned
components built on
[react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html),
with design tokens and documented patterns.

## Install

```shell
pnpm add @mittwald/flow-react-components
```

Import the stylesheet once, at your application's entry point:

```ts
import "@mittwald/flow-react-components/all.css";
```

```tsx
import { Button } from "@mittwald/flow-react-components";

<Button onPress={() => alert("Hi")}>Los geht's</Button>;
```

## Documentation

- **[USAGE.md](./USAGE.md)** — how to build an application with Flow: component
  selection, layout and spacing, what is safe to depend on, common mistakes.
  Written for AI coding agents as much as for people, and shipped in this
  package so it is available offline.
- <https://flow.mittwald.de> — the full documentation. Machine-readable at
  [`/llms.txt`](https://flow.mittwald.de/llms.txt),
  [`/llms.json`](https://flow.mittwald.de/llms.json) and per page at
  `/raw/<path>.md`. Written in German.
- <https://storybook.flow-components.de> — Storybook.
- `@mittwald/flow-react-components/component-index` — a JSON index of every
  public component with its lifecycle status and props.
- [MIGRATION.md](./MIGRATION.md) — upgrade notes. The codemods among them run
  from one command: `npx @mittwald/flow-codemods@latest upgrade`.

## Contributing

Source, issues and contributor documentation:
<https://github.com/mittwald/flow>.
