# Migrations

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
