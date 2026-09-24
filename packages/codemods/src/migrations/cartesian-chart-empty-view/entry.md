---
since: 0.2.0-alpha.676
title: CartesianChart.emptyView changed
kind: migration
action: codemod
remotePackage: true
apply: >-
  Wrap the `emptyView` value in JSX — `emptyView={<EmptyState />}` instead of
  `emptyView={EmptyState}`. A codemod does this where the source resolves the
  identifier to a component: an import, a `function`/`class` declaration, or a
  `const` holding a function. It declines what it cannot decide — an identifier
  it cannot resolve in the file, a chart built through
  `typedCartesianChart<T>()` (its local binding is a call result, not an
  import), and a spread that might carry `emptyView`. Check those by hand.
---

Component references are no longer accepted for `emptyView` - must be a rendered
element now.

```diff
- <CartesianChart emptyView={EmptyState} />
+ <CartesianChart emptyView={<EmptyState />} />
```

A codemod does the rewrite, but only where the file itself says the identifier
is a component — an import binding, a `function` or `class` declaration, or a
`const` initialised with a function. A PascalCase name is not evidence on its
own: `emptyView={Placeholder}` is just as plausibly a variable already holding
an element, and wrapping that yields `<Placeholder />` on a non-component.
