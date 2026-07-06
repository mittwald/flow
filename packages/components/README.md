# @mittwald/flow-react-components

This package is part of
[Flow – mittwald design system](https://flow.mittwald.de/). See the homepage for
more details.

## CSS layer

The bundled stylesheet `@mittwald/flow-react-components/all.css` declares a
stable Flow layer order:

```css
@layer flow.reset, flow.base, flow.theme, flow.components;
```

Flow uses these layers for broad CSS concerns:

- `flow.reset`: scoped reset rules for Flow component roots
- `flow.base`: design token base values, fonts, and global Flow defaults
- `flow.theme`: theme tokens and theme selection rules
- `flow.components`: component styles

Applications can place their own overrides in a later layer:

```css
@layer flow, app;

@import "@mittwald/flow-react-components/all.css";

@layer app {
  .flow--button {
    border-radius: 4px;
  }
}
```

Theme-related rules are emitted in the nested layer `flow.theme`. Applications
can override theme tokens in a later layer without changing Flow's default theme
selection:

```css
@layer flow, app;

@import "@mittwald/flow-react-components/all.css";

@layer app {
  :root[data-theme="dark"] {
    --text--color--default: var(--color--gray--1100);
  }
}
```

To force a theme for a specific part of an application, import the optional
scoped theme stylesheet after `all.css` and set `data-flow-theme` on a
container:

```css
@import "@mittwald/flow-react-components/all.css";
@import "@mittwald/flow-react-components/scoped-theme.css";
```

```html
<section data-flow-theme="dark">
  <!-- Flow components in this subtree use dark theme tokens. -->
</section>
```

## Contributing

### Dev Environment

To start the dev environment for the components package, run from the root
directory of the repository:

```shell
pnpm nx dev components
```
