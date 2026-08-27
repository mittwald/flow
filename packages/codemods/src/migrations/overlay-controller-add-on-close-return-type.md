---
since: 0.2.0-alpha.696
title: OverlayController.addOnClose / addOnOpen return type changed
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'addOnClose|addOnOpen'
apply:
  "No type change needed: the return type widened from `() => void` to `() =>
  unknown`, and a `() => void` callback stays assignable. Instead, check every
  callback passed to `addOnClose`/`addOnOpen` for one that can return `false` —
  for example an arrow function whose body is an expression evaluating to
  `false`. `executeHandlers` now treats any handler returning `false` as a veto
  and cancels the close/open. A callback that returned `false` incidentally,
  with no intent to block anything, now silently cancels closes."
verify:
  No compiler check catches this — `() => unknown` accepts every prior handler,
  so `tsc --noEmit` passes before and after. Review each
  `addOnClose`/`addOnOpen` handler by hand for one that can return `false`, and
  confirm the overlay still closes/opens as expected when that handler runs.
---

The return type changed from `() => void` to `() => unknown`
