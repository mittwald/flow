# <svg fill="currentColor" width="88px" height="29px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" focusable="false" role="img" aria-hidden="true" class="flow--icon flow--icon--size-m page-module-scss-module__4Y8CKa__logo"><g><g><path d="M60.38,88.53v107.98H23.22v-107.98H0v-32.22h23.22v-7.55C23.22,18.29,42.96,0,70.54,0c10.45,0,20.03,2.32,26.71,5.81l-7.55,26.71c-2.9-2.03-6.97-3.48-11.9-3.48-10.45,0-17.42,6.97-17.42,19.74v7.55h28.45v32.22h-28.45ZM110.01,196.52V2.9h36.87v193.61h-36.87Z"></path><path d="M174.45,126.27c0-39.77,27.87-73.44,74.02-73.44s74.31,33.67,74.31,73.44-27.87,73.73-74.31,73.73-74.02-33.67-74.02-73.73ZM284.47,126.27c0-21.77-13.06-40.64-35.99-40.64s-35.7,18.87-35.7,40.64,12.77,40.93,35.7,40.93,35.99-18.87,35.99-40.93Z"></path><path d="M473.15,196.52l-29.61-95.5-29.61,95.5h-39.48l-42.67-140.2h38.32l26.12,94.34,30.77-94.34h32.8l30.77,94.34,26.12-94.34h38.32l-42.67,140.2h-39.19Z"></path><rect x="561.53" y="158.05" width="38.47" height="38.47"></rect></g></g></svg>

## The mittwald. Design System

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

- **119 components** covering actions, forms, overlays, navigation, data
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
