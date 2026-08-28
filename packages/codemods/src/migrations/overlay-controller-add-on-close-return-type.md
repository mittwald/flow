---
since: 0.2.0-alpha.696
title: OverlayController.addOnClose / addOnOpen return type changed
kind: migration
action: manual
remotePackage: true
apply:
  "No type change needed: the return type widened from `() => void` to `() =>
  unknown`, and a `() => void` callback stays assignable. Instead, check every
  callback passed to `addOnClose`/`addOnOpen` for one that can return `false` —
  for example an arrow function whose body is an expression evaluating to
  `false`. `executeHandlers` now treats any handler returning `false` as a veto
  and cancels the close/open. A callback that returned `false` incidentally,
  with no intent to block anything, now silently cancels closes."
---

The return type changed from `() => void` to `() => unknown`
