---
since: 0.2.0-alpha.802
title: "password-tools: `AsyncRule` and `SyncRule` replaced by `Rule`"
kind: migration
action: codemod
remotePackage: false
detect: rg -t ts 'AsyncRule|SyncRule'
apply:
  Replace `AsyncRule` and `SyncRule` imports from
  `@mittwald/flow-react-components/mittwald-password-tools-js` with `Rule`.
  Update custom rule classes to extend `Rule` instead.
verify: tsc --noEmit passes, and `rg 'AsyncRule|SyncRule'` finds nothing.
---

The `@mittwald/flow-react-components/mittwald-password-tools-js` entry no longer
exports `AsyncRule` and `SyncRule`. The underlying `@mittwald/password-tools-js`
merged both into a single abstract `Rule`.

```diff
- import { AsyncRule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
+ import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
```

A custom rule extends `Rule` and may return its result synchronously or as a
promise — the distinction the two classes used to encode is gone.

A codemod replaces both names. A file that imported both — or one of them next
to `Rule` — ends up with a single import.
