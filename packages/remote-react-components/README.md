# @mittwald/flow-remote-react-components

This package is part of
[Flow – mittwald design system](https://mittwald.github.io/flow/). See the
homepage for more details.

## Migrate from Flow to Flow-Remote

#### Update `package.json`

```shell
yarn remove @mittwald/flow-react-components
yarn add @mittwald/flow-remote-react-components@experimental
```

#### Adjust imports in you code

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/0.2.0/packages/codemods/src/transforms/flowRemote.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder. If you do not use TypeScript in your
project, use `--parser jsx`.
