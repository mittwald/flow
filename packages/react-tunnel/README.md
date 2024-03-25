# @mittwald/react-tunnel

It's like a Portal – but with React components

Renders everything inside `<TunnelEntry id="tunnelId" />` in the corresponding
`<TunnelExit id="tunnelId" />`.

```jsx
import { TunnelProvider, TunnelEntry, TunnelExit } from "@mittwald/react-tunnel";

function App() {
  return (
    <TunnelProvider>
      <h1>My cool App</h1>
      <TunnelExit id="callToAction" />
      <PagesRouter />
    </>
  );
}

function ProfilePage(props) {
  const { user } = props;
  return (
    <Page>
      <EditProfileForm />
      {!user.mfaEnabled && (
        <TunnelEntry id="callToAction">
          <Link href="/profile/mfa">Enable MFA</Link>
        </TunnelEntry>
      )}
    </Page>
  );
}
```

## Components

### `<TunnelProvider />`

This component manages the "transfer" and must be a parent of all Tunnel
components.

### `<TunnelExit />`

This component renders the children placed inside the corresponding
`<TunnelEntry />`. All children of the `<TunnelExit />` itself are rendered, if
nothing is in the TunnelEntry.

#### Props

- `id`: Use the `id` prop to identify multiple Tunnels.

### `<TunnelEntry />`

All children of this component are rendered inside the corresponding
`<TunnelExit />`.

#### Props

- `id`: Use the `id` prop to identify multiple Tunnels.
