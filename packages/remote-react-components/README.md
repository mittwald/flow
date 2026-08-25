# @mittwald/flow-remote-react-components

The React API for building **mStudio extension** UIs. Components are generated
from `@mittwald/flow-react-components` and render on the mStudio host through
Flow's remote-DOM layer.

Part of [Flow – mittwald design system](https://flow.mittwald.de/).

**[USAGE.md](./USAGE.md)** — how to build an extension with this package: the
remote component surface, which props cross the boundary, what survives
serialization. Read
[the components package's USAGE.md](https://www.npmjs.com/package/@mittwald/flow-react-components?activeTab=code)
alongside it for the shared component and layout rules.

## Migrate from Flow to Flow-Remote

#### Update `package.json`

```shell
yarn remove @mittwald/flow-react-components
yarn add @mittwald/flow-remote-react-components

pnpm remove @mittwald/flow-react-components
pnpm add @mittwald/flow-remote-react-components
```

#### Adjust imports in your code

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/flowRemote.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder. If you do not use TypeScript in your
project, use `--parser jsx`.
