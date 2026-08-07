# Flow

## mStudio Design System

A React component library and a remote-rendering system, built by
[mittwald](https://www.mittwald.de).

[![npm](https://img.shields.io/npm/v/@mittwald/flow-react-components?logo=npm&color=cb0000)](https://www.npmjs.com/package/@mittwald/flow-react-components)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D24-3c873a.svg?logo=node.js&logoColor=white)](package.json)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785.svg?logo=storybook&logoColor=white)](https://storybook.flow-components.de)
[![Docs](https://img.shields.io/badge/docs-flow.mittwald.de-0aa8d2.svg)](https://flow.mittwald.de)

Flow gives mittwald a single, accessible UI foundation — and lets
[mStudio](https://developer.mittwald.de) extensions render sandboxed interfaces
with those same components from inside an iframe.

- 📘 **Documentation:** <https://flow.mittwald.de>
- 🎛️ **Storybook:** <https://storybook.flow-components.de>
- 🧩 **Extension developer portal:** <https://developer.mittwald.de>

> ⚠️ **Early development — stability notice**
>
> Flow is in early development and we offer no stability guarantees of any kind.
> Try it and tell us what you think — but don't rely on any input or output
> staying stable between releases.

## Highlights

- **Various components** covering actions, forms, overlays, navigation, data
  visualization, content, and status.
- **Accessible by default** — most components wrap
  [react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html),
  so keyboard behavior, focus management, and ARIA come built in.
- **Design tokens** compiled from YAML to CSS variables via
  [style-dictionary](https://styledictionary.com/) — colors, typography,
  spacing, and radii stay consistent and themeable.
- **Contextual composability** — components adapt to where they're used (an
  `Icon` inside an `Alert` sizes itself; a `Heading` inherits its level) instead
  of needing props threaded through by hand.
- **Remote rendering** — the same components render inside sandboxed mStudio
  extensions across a versioned, backwards-compatible protocol.
- **Two icon sets** ([Tabler](https://tabler.io/icons) +
  [FontAwesome](https://fontawesome.com)), a standalone stylesheet, i18n
  (German + English, ICU MessageFormat), RTL support, and light/dark themes.

## Installation

```shell
npm install @mittwald/flow-react-components
```

React 19 and `react-dom` 19 are peer dependencies.

## Quick start

Import the stylesheet once at your app's entry point, then use components
anywhere:

```tsx
import "@mittwald/flow-react-components/all.css";
import { Button } from "@mittwald/flow-react-components";

export default function App() {
  return <Button>Hello Flow</Button>;
}
```

Prefer to override Flow's styles without specificity tricks? Import the
[CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
variant instead — `@mittwald/flow-react-components/all-layered.css`. See the
[stylesheet guide](https://flow.mittwald.de) for when to use which.

Set application-wide component defaults once by wrapping your app in
`ComponentDefaultsProvider`; every individual usage still wins over the default.

## How Flow is built

Flow is three systems in one monorepo.

### 1. Design system core

React components in [`packages/components`](packages/components), styled with
SCSS modules and design-token CSS variables. The icon sets, the standalone
stylesheet, and the docs site build on top.

### 2. Remote DOM (`flr` = **Fl**ow **R**emote)

mStudio extensions run in a hidden iframe and render UI that the host
materializes with real Flow components — so an extension gets native look, feel,
and accessibility without shipping its own copy of the design system.

```
extension (iframe)                          host (mStudio)
RemoteRoot + remote React components  ───►  RemoteRenderer + RemoteReceiver
   │  @quilted/threads connection              │
   └─ hidden remote DOM (flr-* elements) ───►  maps flr-* to Flow components
```

The connection protocol is **versioned** — the host negotiates with each remote
version, and the props of remote-capable components are a stable contract with
extension developers. Full picture: [docs/remote-ui.md](docs/remote-ui.md).

### 3. Token pipeline

[`packages/design-tokens`](packages/design-tokens) holds token YAML — the design
authority, defined together with UX. style-dictionary compiles it to CSS
variables and JSON that every other package consumes.

## Packages

nx + pnpm workspace monorepo. The published packages:

| Package                                  | Description                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `@mittwald/flow-react-components`        | The component library — the heart of Flow.                                  |
| `@mittwald/flow-design-tokens`           | Design tokens (YAML source → CSS variables + JSON).                         |
| `@mittwald/flow-icons`                   | Icon set generated from [Tabler](https://tabler.io/icons).                  |
| `@mittwald/flow-icons-pro`               | Icon set generated from [FontAwesome](https://fontawesome.com).             |
| `@mittwald/flow-stylesheet`              | The components' stylesheet as a standalone, framework-agnostic CSS package. |
| `@mittwald/flow-remote-core`             | Remote connection + serialization layer (versioned protocol).               |
| `@mittwald/flow-remote-elements`         | Custom `flr-*` elements for the remote side.                                |
| `@mittwald/flow-remote-react-components` | React API used _inside_ remote apps (extensions).                           |
| `@mittwald/flow-remote-react-renderer`   | Host-side renderer mapping `flr-*` elements to Flow components.             |
| `@mittwald/ext-bridge`                   | mStudio extension bridge (node / browser / react / i18next entries).        |
| `@mittwald/react-tunnel`                 | Generic "portal for components" utility.                                    |
| `@mittwald/mstudio-ext-react-components` | Helpers for mStudio extension developers (page header customization).       |

Apps live in [`apps/`](apps): the documentation site ([`apps/docs`](apps/docs))
and a remote-rendering demo ([`apps/remote-dom-demo`](apps/remote-dom-demo)).

## Migration

See the [Migration Guide](packages/components/MIGRATION.md). Full history is in
[CHANGELOG.md](CHANGELOG.md).

## Contributing

Contributions are welcome — the full guide is in [CONTRIBUTE.md](CONTRIBUTE.md).
To get started:

```shell
corepack enable && pnpm install   # setup (Node >= 24)
pnpm nx dev components            # component dev environment (Storybook on :6006)
```

Common tasks:

```shell
pnpm build            # build everything (runs all generators)
pnpm test             # unit + compile tests
pnpm lint             # eslint + stylelint + format:check
```

This repo is optimized for AI coding agents as well as humans: every package
ships an `AGENTS.md` next to its code with the patterns and footguns specific to
that area. Start with the root [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE) © Mittwald CM Service GmbH & Co. KG and contributors
