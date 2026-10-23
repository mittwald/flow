---
since: 0.2.0-alpha.696
title: OverlayController.addOnClose / addOnOpen return type changed
kind: migration
action: manual
remotePackage: true
apply:
  "No type change needed: the return type widened from `() => void` to `() =>
  unknown`, and a `() => void` callback stays assignable. Instead, check every
  callback passed to `addOnClose`/`addOnOpen` for one that can return `false`.
  `executeHandlers` now treats any handler returning `false` as a veto and
  cancels the close/open, so a callback that returned `false` incidentally, with
  no intent to block anything, now silently cancels closes. Only one shape is at
  risk: an arrow function with an **expression** body, where the expression is
  the return value (`addOnClose(() => setDirty(false))`). A block body without a
  `return` cannot return anything, and a function reference is worth one look at
  its body. So the search is the expression-body call sites — `addOnClose(() =>`
  and `addOnOpen(() =>` without a following `{` — and the question at each is
  whether that expression can evaluate to `false`."
---

The return type changed from `() => void` to `() => unknown`

```diff
- controller.addOnClose(() => hasUnsavedChanges && warn());
+ controller.addOnClose(() => {
+   hasUnsavedChanges && warn();
+ });
```

The diff is not a type fix — both versions compile. It is the veto: the
expression body returns whatever `hasUnsavedChanges && warn()` evaluates to, and
if that is `false` the overlay no longer closes. A block body returns
`undefined`, which is not a veto.
