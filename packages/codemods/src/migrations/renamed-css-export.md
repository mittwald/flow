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

The CSS export `@mittwald/flow-react-components/styles` is now
`@mittwald/flow-react-components/all.css` — the file holds the CSS of all
components, and there are per-component CSS exports as well.

```diff
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
