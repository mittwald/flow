---
since: 0.2.0-alpha.1000
title: "`password-tools` entry renamed to `mittwald-password-tools-js`"
kind: migration
action: codemod
remotePackage: false
apply:
  Replace the import path `@mittwald/flow-react-components/password-tools` with
  `@mittwald/flow-react-components/mittwald-password-tools-js`.
---

The subpath export carrying the `@mittwald/password-tools-js` integration is
called `@mittwald/flow-react-components/mittwald-password-tools-js`. Between
`0.2.0-alpha.913` and `0.2.0-alpha.999` it was called
`@mittwald/flow-react-components/password-tools`; `0.2.0-alpha.1000` reverted
that name.

```diff
- import { Rule } from "@mittwald/flow-react-components/password-tools";
+ import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
```

Only code written against a version inside that window is affected. There is no
deprecation path and no fallback: a subpath export that no longer exists is a
hard `TS2307` ("Cannot find module") and fails the build.
