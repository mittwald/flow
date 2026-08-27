---
since: 0.2.0-alpha.1047
title: Align renamed to Combine
kind: migration
action: codemod
remotePackage: true
detect: rg -t ts -t tsx '\bAlign(Props)?\b'
apply:
  Rename `Align` to `Combine` and `AlignProps` to `CombineProps`, for named,
  aliased and namespace imports from a Flow package.
verify: tsc --noEmit passes, and `rg '\bAlign\b'` finds no Flow import.
---

`Align` is now `Combine`. The props type follows: `AlignProps` is
`CombineProps`. An import under a local alias keeps its alias — only the
imported name changes.

```diff
- import { Align } from "@mittwald/flow-react-components";
+ import { Combine } from "@mittwald/flow-react-components";
```
