---
since: 1.1.40
title: "@tabler/icons-react is no longer installed alongside Flow"
kind: migration
action: manual
remotePackage: true
apply:
  Only affects code that imports from `@tabler/icons-react` — typically a
  `<Icon><IconSomething /></Icon>` using an icon that is not in Flow's own set.
  Add the package to your own dependencies (`npm i @tabler/icons-react`); the
  imports themselves stay unchanged. Flow's own `Icon*` components are
  unaffected, keep their names, and render exactly as before.
---

Flow no longer depends on `@tabler/icons-react`. `@mittwald/flow-icons` carries
the path data of the 123 icons it uses directly, so a Flow install stops pulling
in 74 MB and ~24,000 files it never needed.

The icons themselves do not change: same names, same exports, same rendered
`<svg>` including the `tabler-icon` and `tabler-icon-<name>` classes.

The one thing that breaks is code which imported `@tabler/icons-react` without
declaring it, and got it because npm hoisted Flow's copy into the project's
`node_modules`. That copy is gone. Declare the package where you use it:

```shell
npm i @tabler/icons-react
```

```tsx
// unchanged — it just needs the package in your own dependencies now
import { IconStar } from "@tabler/icons-react";

<Icon>
  <IconStar />
</Icon>;
```
