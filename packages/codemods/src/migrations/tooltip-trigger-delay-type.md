---
since: 0.2.0-alpha.1016
title: TooltipTrigger changed delay type
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'TooltipTrigger'
apply:
  Replace every numeric `delay` value on `TooltipTrigger` with the matching
  string literal — for example `delay={300}` becomes `delay="default"` and
  `delay={500}` becomes `delay="long"`. The type error names the accepted
  literals.
verify:
  tsc --noEmit passes — a numeric `delay` is a type error, so no separate `rg`
  check is needed.
---

Numeric delay values are no longer accepted; only string literals are valid.

```diff
- <TooltipTrigger delay={300} />
+ <TooltipTrigger delay="default" />

- <TooltipTrigger delay={500} />
+ <TooltipTrigger delay="long" />
```
