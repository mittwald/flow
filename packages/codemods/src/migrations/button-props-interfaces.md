---
since: 0.2.0-alpha.646
title: Removed ResetButton and SubmitButton Interfaces
kind: migration
action: codemod
remotePackage: false
apply:
  Replace `ResetButtonProps`/`SubmitButtonProps` imports from
  `@mittwald/flow-react-components/react-hook-form` with `ButtonProps` from the
  package root. Leave `RemoteButtonElementProps` (from
  `@mittwald/flow-remote-elements`) alone.
---

The `RemoteButtonElementProps`, `ResetButtonProps`, and `SubmitButtonProps`
interfaces have been removed. Use `ButtonProps` instead.

```diff
- import type { SubmitButtonProps } from "@mittwald/flow-react-components/react-hook-form";
+ import type { ButtonProps } from "@mittwald/flow-react-components";
```

Note the entry: `ButtonProps` lives in the package root, while the removed names
came from `react-hook-form`. A codemod moves the import along with the name. It
covers `@mittwald/flow-react-components` only.
`@mittwald/flow-remote-react-components` does not export `ButtonProps`, so there
is nothing to move a remote import onto — pick your own source for the type
there. `RemoteButtonElementProps` is left alone as well:
`@mittwald/flow-remote-elements` still exports that name.
