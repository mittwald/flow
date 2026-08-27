---
since: 0.2.0-alpha.696
title: OverlayController.addOnClose / addOnOpen return type changed
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'addOnClose|addOnOpen'
apply:
  "Update any callback passed to `addOnClose`/`addOnOpen` whose declared return
  type is `void` — it now needs to accept `unknown`, or simply drop an explicit
  `: void` return annotation."
verify: tsc --noEmit passes.
---

The return type changed from `() => void` to `() => unknown`
