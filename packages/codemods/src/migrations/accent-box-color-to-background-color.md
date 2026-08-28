---
since: 0.2.0-alpha.786
title: AccentBox.color is now a declaration for foreground
kind: migration
action: codemod
remotePackage: true
detect: rg -t ts 'AccentBox'
apply:
  Move every `color` value that is not one of `"default" | "dark" | "light" |
  "dark-static" | "light-static"` to `backgroundColor` instead. Review
  `color={expression}` and any element that already has `backgroundColor` by
  hand — neither can be decided from the value alone.
verify: tsc --noEmit passes, and `rg 'AccentBox'` hits are all reviewed.
---

The `color` property now controls foreground colors. Use the `backgroundColor`
property to set the background color instead.

```diff
- <AccentBox color="gradient">
+ <AccentBox backgroundColor="gradient" />
```

`color` did not go away, it changed meaning — so this is not a rename. It used
to accept `"blue" | "green" | "gradient" | "neutral"` and now accepts
`"default" | "dark" | "light" | "dark-static" | "light-static"`.

A codemod decides per value: a value from the new foreground union stays on
`color`, every other literal moves to `backgroundColor`. Two cases stay
untouched, because neither can be decided from the value alone — check them by
hand:

- `color={expression}`, where the same expression means the background in old
  code and the foreground in new code.
- An element that already carries `backgroundColor`, where moving `color` there
  would overwrite the explicit value.

One value changes what you see: the runtime fallback maps `"neutral"`,
`"gradient"` and `"green"` onto the background, but not `"blue"`, so
`<AccentBox color="blue">` currently renders the neutral background. The codemod
turns it into `backgroundColor="blue"`, which restores the blue one.
