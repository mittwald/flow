---
since: 0.2.0-alpha.676
title: CartesianChart.emptyView changed
kind: migration
action: manual
remotePackage: true
apply: >-
  Wrap the `emptyView` value in JSX — `emptyView={<EmptyState />}` instead of
  `emptyView={EmptyState}` — wherever the value is a **component**. Leave it
  alone wherever the value is already an element, including a variable holding
  one (`const view = <EmptyState />; emptyView={view}`), which was valid before
  and still is. That distinction is why there is no codemod: an uppercase
  identifier is a naming convention, not proof, and wrapping an element in JSX
  breaks it.
---

Component references are no longer accepted for `emptyView` - must be a rendered
element now.

```diff
- <CartesianChart emptyView={EmptyState} />
+ <CartesianChart emptyView={<EmptyState />} />
```

The old form still renders — `CartesianChart` calls the value as a component
when it is not a valid element — but logs a deprecation warning and will stop
working in a future major version.

An `emptyView` that was already an element needs nothing:

```tsx
// unchanged, both before and after
const emptyView = <EmptyState />;
<CartesianChart emptyView={emptyView} />;
```

Telling the two apart is what a codemod cannot do. `emptyView={X}` says nothing
about whether `X` is a component or a value holding an element — both are
idiomatic, both are usually capitalised, and only following the declaration
answers it. Resolve each site by hand; the runtime warning names the ones that
are still on the old form.
