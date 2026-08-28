---
since: 0.1.0-alpha.292
title: Renamed CSS export
kind: migration
action: manual
remotePackage: false
detect: rg 'flow-react-components/styles'
apply:
  Replace the import `@mittwald/flow-react-components/styles` with
  `@mittwald/flow-react-components/all.css`.
verify:
  The bundle builds and the stylesheet is present; `rg
  'flow-react-components/styles'` finds nothing.
---

The CSS export `@mittwald/flow-react-components/styles` has renamed to the more
precise name `@mittwald/flow-react-components/all.css`, because the file
contains the CSS of all components, and now there are CSS exports per component
as well. A documentation on how to use them is planned.

```diff
// main.js
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
