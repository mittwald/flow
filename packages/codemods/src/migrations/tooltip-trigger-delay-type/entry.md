---
since: 0.2.0-alpha.1016
title: TooltipTrigger changed delay type
kind: migration
action: manual
remotePackage: true
apply:
  'Replace every numeric `delay` value on `TooltipTrigger` with one of the two
  string literals: `"default"` (400ms) or `"long"` (1500ms). Pick by intent, not
  by which number is closer — `"default"` is for elements that cannot be
  understood without the tooltip (icon-only buttons), `"long"` is for
  supplementary information on elements that are already labeled. A previous
  numeric value is not a reliable guide: `delay={500}` maps to `"default"`
  (400ms), not `"long"` (1500ms), if the element still needs the tooltip to be
  understood.'
---

Numeric delay values are no longer accepted; only the string literals
`"default"` (400ms) and `"long"` (1500ms) are valid. Pick by what the element
needs, not by rounding the old number to the nearest preset — a former
`delay={500}` is closer to `"long"` numerically, but if the element is an
icon-only button that cannot be understood without the tooltip, `"default"` is
still the right choice.

```diff
- <TooltipTrigger delay={300} />
+ <TooltipTrigger delay="default" />
```

For an icon-only button that needs the tooltip to be understood.

```diff
- <TooltipTrigger delay={2000} />
+ <TooltipTrigger delay="long" />
```

For supplementary information on an element that is already labeled.
