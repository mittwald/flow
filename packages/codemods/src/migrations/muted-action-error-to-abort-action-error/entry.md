---
since: 0.2.0-alpha.712
title: "`MutedActionError` renamed to `AbortActionError`"
kind: migration
action: codemod
remotePackage: false
apply:
  Rename `MutedActionError` to `AbortActionError`, `isMutedActionError` to
  `isAbortActionError`, and `rethrowIfNotMuted` to `rethrowIfNotAborted`. Update
  any `error.name === "MutedActionError"` comparison to `"AbortActionError"`.
---

The error that aborts an `Action` without reporting a failure is now called
`AbortActionError`. Its static helpers were renamed along with it.

```diff
- import { MutedActionError } from "@mittwald/flow-react-components";
+ import { AbortActionError } from "@mittwald/flow-react-components";

- throw new MutedActionError();
+ throw new AbortActionError();

- MutedActionError.isMutedActionError(error);
+ AbortActionError.isAbortActionError(error);

- MutedActionError.rethrowIfNotMuted(error);
+ AbortActionError.rethrowIfNotAborted(error);
```

There is no alias for the old name. The thrown error's `name` changed from
`"MutedActionError"` to `"AbortActionError"` as well — update any code that
matches on it.

A codemod renames the class and both static helpers. It also rewrites an
`error.name === "MutedActionError"` comparison, but only in a file that imports
the class — a check living anywhere else cannot be recognised, so grep for the
string once when you are done.
