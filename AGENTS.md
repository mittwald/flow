# Agent conventions

## Running package scripts

Always run package scripts through **corepack** so the pinned pnpm version is used.
Prefer building a single package with pnpm's `--filter` (runs just that package's
script, without pulling in the nx dependency graph), e.g.:

```
corepack pnpm --filter @mittwald/flow-remote-react-components build
corepack pnpm --filter @mittwald/flow-react-components build
corepack pnpm <script>
```

Do not use `npx`/`npm`/bare `pnpm` to run workspace tasks — go through
`corepack pnpm …`.
