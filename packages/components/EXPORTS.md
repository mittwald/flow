# Public API surfaces

Part of the
[components agent guide](https://github.com/mittwald/flow/blob/main/packages/components/AGENTS.md),
split out because only work on the package's export entries needs it.

| Export                                                          | Contents                                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.` (default)                                                   | Everything listed **manually** in `src/components/public.ts` — new public components must be added there.                                                                                                                                           |
| `./internal`                                                    | Advanced internals (`flowComponent`, prop helper types, …).                                                                                                                                                                                         |
| `./flr-universal`                                               | Curated subset that works local _and_ remote. Adding to `public.ts` does **not** add here.                                                                                                                                                          |
| `./tunnel`                                                      | `@mittwald/react-tunnel` re-exported (`src/index/tunnel.ts`) plus `getTunnelProviderId`, so a consumer's own tunnels share Flow's module instance instead of creating a second React context.                                                       |
| `./nextjs`, `./react-hook-form`, `./mittwald-password-tools-js` | Integrations (`src/integrations/`): wrappers around third-party dependencies that not every consumer should pay for — they get their own export entry instead of entering the core surface.                                                         |
| `./all.css`, `./all-layered.css`                                | Bundled stylesheet, plain and `@layer`-wrapped.                                                                                                                                                                                                     |
| `./component-index`                                             | Generated consumer-facing index: every public component with its status and its own props (`dev/component-index/`). What the docs site's prop tables read, and the one prop dataset a consumer's agent should use.                                  |
| `./doc-properties`                                              | `react-docgen-typescript` output in its raw `ComponentDoc[]` shape, filtered to the props a consumer can act on. Prefer `./component-index`. The unfiltered dump the generators above read is `.cache/doc-properties.json`, which is not published. |

**Adding any new export entry?** Add the subpath to `keptSubpaths` in
`packages/codemods/src/migrations/imports-to-package-root/transform.ts`. That
codemod collapses subpath imports onto the package root with a catch-all `else`,
so a subpath that is not listed gets flattened onto a root that does not export
its names. The guard beside the transform fails the codemods unit tests when you
forget.

**Adding a new integration export entry?** Also register it in the component
status registry so it is covered: add the entry to `STATUS_EXPORT_ENTRIES`
(`dev/status-registry/exportEntries.ts`) — the `FlowExportEntry` union and the
registry regenerate from it. A generation-time guard fails if an entry resolves
to zero components.
