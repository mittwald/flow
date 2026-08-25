# Migrations

---

## From version `0.2.0-alpha.1050` to `>=0.2.0-alpha.1051`

### Context parameters are typed, and config values are never `null`

The config type and the runtime parse disagreed about unknown keys: the type
stripped them, the runtime kept them. An extension reading a host-supplied
context parameter such as `containerId` had to narrow at runtime
(`typeof x === "string"`) because the type said the key did not exist.

Both sides agree again. The known context parameters are declared, an undeclared
one still comes through, and every optional config value is typed
`string | undefined`:

```diff
- const containerId =
-   typeof (config as Record<string, unknown>).containerId === "string"
-     ? (config as Record<string, unknown>).containerId
-     : undefined;
+ const containerId = config.containerId;
```

Declared context parameters: `aiApiKeyId`, `appInstallationId`, `backupId`,
`certificateId`, `containerId`, `contractId`, `conversationId`, `cronjobId`,
`customerId`, `databaseId`, `deliveryBoxId`, `domainId`, `emailAddressId`,
`ingressId`, `leadId`, `licenseId`, `mailAddressId`, `projectId`, `registryId`,
`scheduleId`, `serverId`, `sftpUserId`, `sshUserId`, `stackId`, `templateId`,
`zoneId`. `emailAddressId` (use `mailAddressId`) and `ingressId` (use
`domainId`) are deprecated and stay declared.

**Type-breaking:** optional config values lost `null` from their type —
`variantKey` was `string | null | undefined` and is now `string | undefined`,
and the same applies to every context parameter and to unknown keys. A host that
still sends `null` is parsed as "value absent", so `null` no longer reaches a
consumer. Narrowing with `typeof x === "string"` or a truthiness check keeps
working unchanged; only an explicit `=== null` branch becomes dead code and can
go:

```diff
- if (config.variantKey === null) {
-   return fallback;
- }
  if (config.variantKey === undefined) {
    return fallback;
  }
```

---

## From version 0.2.0-alpha.1020 to version 0.2.0-alpha.1021

### `HostConfig` no longer comes from an unpublished package

Between `0.2.0-alpha.789` and `0.2.0-alpha.1020`, the published types imported
`HostConfig` from `@mittwald/flow-core` — a private workspace package that is
not on npm. `tsc` stayed quiet because of `skipLibCheck`, but the import
resolved to nothing, so `useConfig()` and `getConfig()` collapsed to the error
type. Typed lint rules (`@typescript-eslint/no-unsafe-*`) then failed on every
usage.

`HostConfig` is now declared in `@mittwald/ext-bridge` itself and exported from
the package root:

```ts
import type { ExtBridgeConfig, HostConfig } from "@mittwald/ext-bridge";
```

Update to `>=0.2.0-alpha.1021` and remove any local workaround — an ambient
`declare module "@mittwald/flow-core"` stub, a `paths` entry in `tsconfig.json`,
or a hand-written `HostConfig` copy. The same import was removed from
`@mittwald/flow-remote-core` and `@mittwald/flow-remote-react-renderer`.

---

## From version `0.2.0-alpha.940` to `>=0.2.0-alpha.941`

### Node 24 required

`engines.node` went from `>=20.19` to `>=24.0.0`. Node 24 is the only runtime
this package is tested on. Nothing changes in your code — build and run your
extension on Node 24. Installing on Node 20 or 22 warns, and fails outright with
`engine-strict`.

---

## From version `0.2.0-alpha.789` to `>=0.2.0-alpha.790`

### Undeclared context parameters lost their type

The schema's `.catchall()` moved into the internal parse, so the config type
stopped carrying context parameters it did not declare. The runtime kept sending
them, which is why reading one needed a runtime narrowing:

```ts
const containerId =
  typeof (config as Record<string, unknown>).containerId === "string"
    ? (config as Record<string, unknown>).containerId
    : undefined;
```

Fixed in `0.2.0-alpha.1051` — see the entry above and drop the narrowing.

---

## From version `0.2.0-alpha.646` to `>=0.2.0-alpha.647`

### React peer range narrowed to `^19.2.0`

The `react` and `react-dom` peer ranges went from `^19` to `^19.2.0`. On React
19.0 or 19.1 the install warns about an unmet peer — upgrade React to 19.2 or
later.

---

## From version 0.2.0-alpha.150 to version 0.2.0-alpha.151

This guide covers the key changes for migrating to the latest version of the
`@mittwald/ext-bridge` library.

### Key Changes

#### 1. Environment Variable No Longer Required

- **Before**: Setting `MW_EXT_API_URL=api.mittwald.de` was necessary
- **After**: This environment variable is no longer needed

#### 2. Package Export Structure

- **Before**: All functions were imported directly from `@mittwald/ext-bridge`
- **After**: Exports are now split between:
  - `@mittwald/ext-bridge/browser` for browser environments
  - `@mittwald/ext-bridge/node` for Node.js environments

#### 3. Config Access Changes

- **Before**: Used `useExtBridge()` to access configuration
- **After**:
  - React: Use `useConfig()` from `@mittwald/ext-bridge/react`
  - Non-React: Use `getConfig()` from `@mittwald/ext-bridge/browser`

#### 4. Verify Method Moved

- **Before**: `verify()` was available directly from main package
- **After**: `verify()` is now available from `@mittwald/ext-bridge/node`

#### 5. Optional Package Installation

- **Before**: Installing `@mittwald/ext-bridge` was required even when not
  directly used
- **After**: Package only needs to be installed when actually used

#### 6. Global Object Removed

- **Before**: Used global `mittwald` object
- **After**: Use `getConfig()` or `useConfig()` functions instead

### Example Code

```javascript
// Before
import { useExtBridge } from "@mittwald/ext-bridge";
const { config } = useExtBridge();

// After - React component
import { useConfig } from "@mittwald/ext-bridge/react";
const config = useConfig();

// After - Browser (non-React)
import { getConfig } from "@mittwald/ext-bridge/browser";
const config = getConfig();

// Before - verify
import { verify } from "@mittwald/ext-bridge";

// After - verify
import { verify } from "@mittwald/ext-bridge/node";
```

This migration guide covers the most significant changes. Be sure to update all
your imports and method calls according to the new structure.
