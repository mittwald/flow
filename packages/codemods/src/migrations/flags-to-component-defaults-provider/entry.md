---
since: 0.2.0-alpha.1005
title: "`flags` is replaced by the ComponentDefaultsProvider"
kind: deprecation
action: manual
remotePackage: false
apply:
  Replace assignments to the global `flags` object with an equivalent
  `<ComponentDefaultsProvider defaults={{ ... }} />` wrapping the app, or the
  subtree the default should apply to.
---

The global `flags` object is deprecated. Application-wide defaults are defined
with the `<ComponentDefaultsProvider />` instead, which additionally works per
subtree:

```diff
- import { flags } from "@mittwald/flow-react-components";
-
- flags.requireCloseModalConfirmationOnUnsavedChanges = false;
- flags.disableInitialListSuspenseBoundaries = true;
+ import { ComponentDefaultsProvider } from "@mittwald/flow-react-components";
+
+ <ComponentDefaultsProvider
+   defaults={{
+     Form: { confirmModalCloseOnUnsavedChanges: false },
+     List: { disableInitialSuspenseBoundary: true },
+   }}
+ >
+   <App />
+ </ComponentDefaultsProvider>
```

Assigning a flag keeps working — it acts as the application-wide default below
the provider and logs a deprecation warning — but the flags will be removed in a
future release.
