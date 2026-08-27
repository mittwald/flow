---
since: 0.2.0-alpha.28
title: From version 0.1.0 to version 0.2.0
kind: migration
action: codemod
remotePackage: false
detect: rg -t ts 'flow-react-components/'
apply:
  'Rewrite every subdirectory import from `@mittwald/flow-react-components` to
  the package root, except `react-hook-form` and `nextjs`, which move to
  `@mittwald/flow-react-components/react-hook-form` and
  `@mittwald/flow-react-components/nextjs`. If you hit missing module errors,
  set `"module": "esnext"` in `tsconfig.json`.'
verify:
  tsc --noEmit passes, the app still runs, and `rg 'flow-react-components/'`
  finds no remaining subdirectory import other than `react-hook-form`, `nextjs`,
  or a CSS export.
---

With the latest update to `@mittwald/flow-react-components`, the way package
exports are handled has changed. You no longer need to specify subdirectories
explicitly when importing components and utilities. Instead, imports are now
structured in a more streamlined way.

### Changes in Imports

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

### `tsconfig.json`

Set `"module": "esnext"` in your `tsconfig.json`, if you have trouble with
missing module exports.

### Migration Steps

#### Do it manually

1. **Update all import statements** in your project according to the new
   structure.
2. **Remove unnecessary subdirectory paths** from imports.
3. **Verify your application still compiles and runs correctly.**
4. **Run your test suite** to ensure no regressions were introduced by the
   migration.

This change shipped in `0.2.0-alpha.28`: `0.2.0-alpha.27` still published one
export entry per component, `alpha.28` published the flat set. Neither `0.1.0`
nor `0.2.0` was ever released — the headings above name release lines, and the
first stable release of Flow is `1.0.0`.
