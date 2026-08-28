---
since: 0.2.0-alpha.846
title:
  'Breadcrumb, HeaderNavigation, Heading, IllustratedMessage, and Link: color
  property "primary" renamed to "default"'
kind: migration
action: codemod
remotePackage: true
apply:
  Rewrite `color="primary"` to `color="default"` on `Breadcrumb`,
  `HeaderNavigation`, `Heading`, `IllustratedMessage`, and `Link` only — leave
  `Button` (and any other component where `"primary"` is still valid) untouched.
---

The `color="primary"` property has been renamed to `color="default"`.

```diff
- <Link color="primary">
+ <Link color="default" />
```

A codemod rewrites `color="primary"` to `color="default"` on these five
components (and leaves other components such as `Button`, where `"primary"` is
still valid, untouched).
