---
since: 0.1.0-alpha.292
title: Renamed CSS export
kind: migration
action: codemod
remotePackage: false
apply: >-
  Replace the import `@mittwald/flow-react-components/styles` with
  `@mittwald/flow-react-components/all.css`. A codemod does this for JavaScript
  and TypeScript files. An `@import` of the old path inside a `.css` or `.scss`
  file is not covered — search for it by hand.
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

A codemod rewrites the specifier in every JavaScript and TypeScript form that
names a module. It cannot reach a `.css` or `.scss` file, so an `@import` of the
old path there needs a manual search.
