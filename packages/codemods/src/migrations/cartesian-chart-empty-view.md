---
since: 0.2.0-alpha.676
title: CartesianChart.emptyView changed
kind: migration
action: manual
remotePackage: true
apply:
  Wrap the `emptyView` value in JSX — `emptyView={<EmptyState />}` instead of
  `emptyView={EmptyState}`.
---

Component references are no longer accepted for `emptyView` - must be a rendered
element now.

```diff
- <CartesianChart emptyView={EmptyState} />
+ <CartesianChart emptyView={<EmptyState />} />
```
