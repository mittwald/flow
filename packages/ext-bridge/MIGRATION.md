# Migrations

## From version 0.2.0-alpha.849 to version 0.2.0-alpha.850

### `HostConfig` gained `theme`

`ExtBridgeConfig` has a required `theme: "dark" | "light"`, contributed by the
host. Reading it needs no change. Anything **constructing** a config from
`ExtBridgeConfigInput` — mocks, test fixtures — must supply it:

```diff
  const config: ExtBridgeConfigInput = {
    sessionId: "…",
    userId: "…",
    extensionId: "…",
    extensionInstanceId: "…",
    language: "de",
+   theme: "light",
  };
```

This landed while the config type was unresolvable, so it only becomes visible
once you upgrade to `>=0.2.0-alpha.1021` — see the `0.2.0-alpha.1021` entry
above.

---

## From version 0.2.0-alpha.789 to version 0.2.0-alpha.790

### Unknown config keys are no longer typed

The catchall moved out of the exported `config` schema into `parseConfig`, so
the result of `getConfig()` / `useConfig()` lost its index signature:

```diff
- [key: string]: string | null | undefined
+ (no index signature)
```

**Runtime behaviour is unchanged** — `parseConfig` still applies the catchall,
so custom keys are still present in the returned object. Only the type stopped
describing them, so dynamic reads fail to compile:

```
error TS7053: Element implicitly has an 'any' type because expression of type
'string' can't be used to index type 'ExtBridgeConfig'.
```

Known keys (`sessionId`, `userId`, `extensionId`, `extensionInstanceId`,
`variantKey`, `appInstallationId`, `projectId`, `customerId`) are unaffected.
For custom keys, state the shape you expect:

```diff
- const value = config[key];
+ const value = (config as Record<string, string | null | undefined>)[key];
```

Like the entry above, this was masked until `>=0.2.0-alpha.1021`.

---

## From version 0.2.0-alpha.788 to version 0.2.0-alpha.789

### `language` became a required `HostConfig` member

`language` moved from the config schema into the new `HostConfig` interface, and
`ExtBridgeConfig` became an intersection of the parsed environment config and
the host-contributed values. `ExtBridgeConfigInput` was introduced alongside it.

`HostConfig.language` has no default, so anything constructing a config must
supply it:

```diff
  const config: ExtBridgeConfigInput = {
    // …
+   language: "de",
  };
```

This is also the version where the config type stopped resolving for consumers.

---

## From version 0.2.0-alpha.784 to version 0.2.0-alpha.785

### `language` added to the config schema

`language` was added as `z.string().default("de")`, so the **result** of
`getConfig()` / `useConfig()` gained a required `language: string`. Constructing
a config was unaffected at this point, because the default filled it in. That
changed one version step later — see the entry above.

---

## From version 0.2.0-alpha.649 to version 0.2.0-alpha.650

### Unknown config keys can be `null` or `undefined`

The config schema's catchall changed from `z.string()` to
`z.string().optional().nullable()` (#2276), widening the index signature:

```diff
- [key: string]: string
+ [key: string]: string | null | undefined
```

```diff
- const value: string = config[key];
+ const value = config[key] ?? fallback;
```

Superseded by `0.2.0-alpha.790`, which removed the index signature from the type
altogether. Migrating from below `0.2.0-alpha.650` straight to a current
version? Then only that entry matters.

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
