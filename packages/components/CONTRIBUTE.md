# Contribute

## Develop with remote component support

Here are some general rules when developing with support for remote components:

### Avoid using non-remote components in props context

```tsx
export const Component: FC<Props> = (props) => {
  const propsContext: PropsContext = {
    // This could cause issues
    NonRemoteComponent: {
      tunnelId: "actions",
    },
    Button: {
      size: "s",
      tunnelId: "actions",
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        {children}
        <div className={styles.actions}>
          <TunnelExit id="actions" />
        </div>
      </TunnelProvider>
    </PropsContextProvider>
  );
};
```

## Styling with CSS cascade layers

The generated stylesheet (`all.css`) is organized into CSS cascade layers under
a top-level `flow` layer, so that unlayered CSS in a consuming application
overrides Flow automatically. The order (lowest → highest priority) is:

```css
@layer flow.reset, flow.base, flow.components, flow.components-override;
```

- **Component CSS modules** (`*.module.scss` / `*.module.css`) are wrapped in
  `@layer flow.components` automatically at build time — you don't need to do
  anything for normal component styles.
- **Design tokens** (CSS custom properties) and `@font-face` are intentionally
  left unlayered.

### Overriding third-party CSS: `@layer unlayered`

Some components restyle a third-party library whose CSS is injected
**unlayered** at runtime (e.g. CodeMirror in `CodeEditor`, react-easy-crop in
`ImageCropper`). Layered CSS always loses to unlayered CSS, so those overrides
must stay unlayered. Wrap them in a `@layer unlayered { … }` block — the build
unwraps it so the rules are emitted with no layer at all:

```scss
.myWidget {
  // normal styles → end up in @layer flow.components

  @layer unlayered {
    // overrides of the library's runtime CSS → emitted unlayered so they win
    :global(.third-party-class) {
      color: var(--my-token);
    }
  }
}
```

### Raising priority within Flow: `@layer flow.components-override`

To make a rule win over other Flow component styles in a controlled way (without
leaving the layer system), put it in `@layer flow.components-override { … }` —
the highest Flow sublayer.
