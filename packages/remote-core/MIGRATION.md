# Migrations

Most entries here concern code that **implements or mocks** the connection
protocol — a host renderer, a test double, an alternative host. If you only
_call_ the exported functions from an extension, the interface members added
below do not affect you; the `connectRemoteIframe` and `Version` changes do.

---

## From version `0.2.0-alpha.1006` to `>=0.2.0-alpha.1007`

### `HostExports` requires `reportEvent`

The host side reports component usage back to the host (#2765). Anything
implementing `HostExports` must provide the new member.

```diff
  const hostExports: HostExports = {
    getHostConfig,
    reportDeprecation,
+   reportEvent,
    // …
  };
```

---

## From version `0.2.0-alpha.913` to `>=0.2.0-alpha.914`

### `Version` gained `v5`; `HostToRemoteConnection` requires `reportHostError`, `RemoteExports` requires `setHostError`

Remote-side "No component found" errors are surfaced to the host (#2651).

An exhaustive `switch` over `Version` stops compiling — add the new case:

```diff
  switch (connection.version) {
    case Version.v3:
    case Version.v4:
+   case Version.v5:
      // …
  }
```

Prefer a `default` branch over enumerating every member: the protocol version is
expected to grow, so each new version would otherwise break the build.

---

## From version `0.2.0-alpha.904` to `>=0.2.0-alpha.905`

### `HostExports` requires `reportDeprecation`

Remote deprecation notices are forwarded to the host via `onDeprecation`
(#2639). Anything implementing `HostExports` must provide the new member.

---

## From version `0.2.0-alpha.900` to `>=0.2.0-alpha.901`

### `Version` gained `v4`; `RemoteReadyEvent` carries `packageVersion`

The connection handshake exposes the remote package version (#2610). As with
`v5` above, an exhaustive `switch` over `Version` needs the new case.

`setIsReady` now takes `RemoteReadyEventInput` (`Version | RemoteReadyEvent`)
instead of `Version`. Existing calls keep working — the parameter accepts
strictly more than before.

---

## From version `0.2.0-alpha.788` to `>=0.2.0-alpha.789`

### `connectRemoteIframe` requires `hostConfig`

`connectRemoteIframe` and `connectRemoteIframeRef` gained a required
`hostConfig` option, so the host can pass language and theme to the remote side.

```diff
  connectRemoteIframe({
    connection,
    iframe,
+   hostConfig: { language: "de", theme: "light" },
  });
```

The type comes from `@mittwald/ext-bridge`:

```ts
import type { HostConfig } from "@mittwald/ext-bridge";
```

Note that on versions `0.2.0-alpha.789` through `0.2.0-alpha.1020` this type was
not resolvable for consumers (#2826) — if you are migrating across that range,
go to `>=0.2.0-alpha.1021`, where the import above works.

### `extBridgeImplementation` retyped

```diff
- extBridgeImplementation?: ExtBridgeConnectionApi
+ extBridgeImplementation?: RemoteExtBridgeConnectionApi
```

Both types are exported from this package. The option stays optional and
defaults to an empty implementation.
