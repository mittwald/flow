# Migrations

## From version 0.1.0 to version 0.2.0

With the latest update to `@mittwald/flow-react-components`, the way package
exports are handled has changed. You no longer need to specify subdirectories
explicitly when importing components and utilities. Instead, imports are now
structured in a more streamlined way.

## Changes in Imports

Previously, you had to import components and utilities from specific
subdirectories, like this:

```javascript
import Button from "@mittwald/flow-react-components/Button";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import Field from "@mittwald/flow-react-components/react-hook-form/Field";
import { Link } from "@mittwald/flow-react-components/react-hook-form/nextjs";
```

With the new package structure, the same imports should be rewritten as follows:

```javascript
import { Button } from "@mittwald/flow-react-components";
import { useOverlayController } from "@mittwald/flow-react-components";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { Link } from "@mittwald/flow-react-components/nextjs";
```

## `tsconfig.json`

Set `"module": "esnext"` in your `tsconfig.json`, if you have trouble with
missing module exports.

## Migration Steps

### Use Codemod

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/flow020.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder. If you do not use TypeScript in your
project, use `--parser jsx`.

See the [docs of jscodeshift](https://jscodeshift.com/run/cli/)

### Do it manually

1. **Update all import statements** in your project according to the new
   structure.
2. **Remove unnecessary subdirectory paths** from imports.
3. **Verify your application still compiles and runs correctly.**
4. **Run your test suite** to ensure no regressions were introduced by the
   migration.

## Benefits of This Change

- **Simplified import statements** with a clearer structure.
- **Better maintainability** as package updates no longer require path
  modifications.
- **Improved autocompletion support** in modern IDEs.

## From version 0.1.0-alpha.291 to 0.1.0-alpha.292

### Renamed CSS export

The CSS export `@mittwald/flow-react-components/styles` has renamed to the more
precise name `@mittwald/flow-react-components/all.css`, because the file
contains the CSS of all components, and now there are CSS exports per component
as well. A documentation on how to use them is planned.

```diff
// main.js
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
