# @mittwald/flow-remote-react-components

This package is part of
[Flow – mittwald design system](https://mittwald.github.io/flow/). See the
homepage for more details.

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
