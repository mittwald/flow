---
since: 0.2.0
title: Port an app to the remote package
kind: tool
action: codemod
remotePackage: false
apply:
  Rewrite every `@mittwald/flow-react-components` import to
  `@mittwald/flow-remote-react-components`. Run this only when porting an app
  into an mStudio extension — on a normal app it rewrites every Flow import.
---

This is a port, not a migration: it moves an application onto
`@mittwald/flow-remote-react-components` so it can render inside an mStudio
extension. No version range selects it — run it deliberately.

```shell
npx @mittwald/flow-codemods@latest to-remote-package src
```
