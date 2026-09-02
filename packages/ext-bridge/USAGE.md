# Using ext-bridge — guide for agents and developers

`@mittwald/ext-bridge` is the runtime bridge between an **mStudio extension**
and the mStudio host. It answers two questions your extension cannot answer on
its own:

1. **Where am I running?** Which user, which project, which extension instance,
   which language and theme.
2. **How do I prove it?** The session token your own backend exchanges for an
   mStudio API access token.

It renders nothing. For the UI side, see
[`@mittwald/flow-remote-react-components`](https://www.npmjs.com/package/@mittwald/flow-remote-react-components).

## The entry points are not interchangeable

| Specifier                      | Runs in                      | Exports                                         |
| ------------------------------ | ---------------------------- | ----------------------------------------------- |
| `@mittwald/ext-bridge/browser` | the extension iframe         | `initExtBridge`, `getConfig`, `getSessionToken` |
| `@mittwald/ext-bridge/react`   | the extension iframe         | `useConfig`, `useLanguage`                      |
| `@mittwald/ext-bridge/node`    | **your extension's backend** | `getAccessToken`, `verify`                      |
| `@mittwald/ext-bridge/i18next` | the extension iframe         | i18next integration                             |
| `@mittwald/ext-bridge`         | —                            | types only, no runtime                          |

The `/node` entry is the one that matters most to get right: `verify` and
`getAccessToken` handle the extension secret and must **never** run in the
browser. Importing `/node` into client code leaks that secret.

## Reading the context

```tsx
import { useConfig, useLanguage } from "@mittwald/ext-bridge/react";

const config = useConfig();
// config.projectId, config.userId, config.extensionInstanceId, config.theme, …
```

Outside React, `getConfig()` from `/browser` returns the same object. The bridge
initializes itself and resolves once the host reports readiness, so both are
async-safe but neither is synchronous on first call.

What the config carries:

- Always — `sessionId`, `userId`, `extensionId`, `extensionInstanceId`, and the
  host-contributed `language` and `theme`.
- Optional, depending on where the extension is mounted — `appInstallationId`,
  `projectId`, `customerId`, `variantKey`.

**The optional ones are genuinely optional.** An extension mounted at customer
level has no `projectId`. Branch on their presence instead of assuming the
context you happened to test in.

Use `language` and `theme` from the config rather than sniffing the browser or a
media query — the host owns both, and the user's mStudio setting is the truth.

## The auth flow

Three steps, and the middle one is the one people skip:

```ts
// 1. in the iframe
import { getSessionToken } from "@mittwald/ext-bridge/browser";
const sessionToken = await getSessionToken();
// send it to your own backend

// 2. in your backend — verify before trusting anything in it
import { verify, getAccessToken } from "@mittwald/ext-bridge/node";
const decoded = await verify(sessionToken); // JWT signature check

// 3. exchange it for an mStudio API token
const { publicToken, expiry } = await getAccessToken(
  sessionToken,
  process.env.EXTENSION_SECRET!,
);
```

- **Always `verify` first.** A session token arrives from the browser; without
  the signature check its contents are attacker-controlled.
- The extension secret belongs in your backend's environment, never in the
  bundle.
- `getAccessToken` returns an `expiry` — respect it rather than caching the
  token indefinitely.

## Stability

The config schema carries an explicit contract: existing properties are never
removed, renamed or changed, because extensions in the wild read them. New
properties are released on the host before clients can rely on them. So reading
the config is safe across upgrades, and a **newly added** property may not be
populated by an older host yet.

Upgrade notes: [MIGRATION.md](./MIGRATION.md).

## Links

- mStudio extension development — <https://developer.mittwald.de>
- Flow documentation — <https://flow.mittwald.de>
- Source and issues — <https://github.com/mittwald/flow>
