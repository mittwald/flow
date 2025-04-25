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
