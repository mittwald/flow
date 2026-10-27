---
since: 1.5.0
title:
  "Badge, Avatar, Icon, Color, AccentBox: color values follow the brand palette"
kind: migration
action: codemod
remotePackage: true
apply:
  On `Badge`, `Avatar`, `Icon` and `Color`, rename `color="violet"` to
  `color="lilac"` and `color="teal"` to `color="sage"`; on `AccentBox`, do the
  same for `backgroundColor`, and rename `backgroundColor="gradient"` to
  `backgroundColor="gradient-navy"`. On `Badge`, also rename `color="green"` to
  `color="success"`, `color="orange"` to `color="warning"` and `color="red"` to
  `color="danger"`. Each replacement renders exactly like the old value.
  `Avatar`'s `color="green"` is deprecated too, but its replacement `sage` is
  the brand's muted gray-green instead of the success mint. Switch to `sage`
  where the avatar's color carries no meaning, and keep `green` (it still
  renders) only until you have decided; the same holds for `AccentBox`'s
  `backgroundColor="green"`. Content on a colored `AccentBox` now defaults to
  `color="dark"`; drop an explicit `color="dark"` there if you like. If you use
  `@mittwald/flow-stylesheet` or the token CSS variables directly, rename
  `flow--badge--{violet,teal,green,orange,red}` to
  `flow--badge--{lilac,sage,success,warning,danger}`,
  `--badge--{teal,green,orange,red}-*` to
  `--badge--{sage,success,warning,danger}-*`, `--icon--teal-color` to
  `--icon--sage-color`, `--decorative--teal-*` to `--decorative--sage-*`,
  `flow--accent-box--{violet,teal}` and
  `--accent-box--background-color-{violet,teal}` to their `lilac`/`sage`
  counterparts, `flow--accent-box--gradient` and
  `--accent-box--background-color-gradient` to `…-gradient-navy`, drop the
  `--badge--*-border-color` variables (the badge has no border), and replace
  `--badge--violet-*`, `--icon--violet-color` and `--decorative--violet-*` by
  their `lilac` counterparts.
---

The decorative color values now follow the brand palette: one value per mittwald
brand color, named after how it looks — `blue`, `navy`, `lilac`, `sage` and
`salmon`, the same list on `Badge`, `Avatar`, `Icon`, `Color` and `AccentBox`
(`backgroundColor`). `Badge` names its status hues by their meaning: `success`,
`warning` and `danger`.

```diff
- <Badge color="red">Gesperrt</Badge>
- <Badge color="teal">Projekt</Badge>
+ <Badge color="danger">Gesperrt</Badge>
+ <Badge color="sage">Projekt</Badge>
```

| Deprecated                | Use instead     | Looks the same |
| ------------------------- | --------------- | -------------- |
| `violet` (all four)       | `lilac`         | yes            |
| `teal` (all four)         | `sage`          | yes            |
| `green` on `Badge`        | `success`       | yes            |
| `orange` on `Badge`       | `warning`       | yes            |
| `red` on `Badge`          | `danger`        | yes            |
| `green` on `Avatar`       | `sage`          | no             |
| `green` on `AccentBox`    | `sage`          | no             |
| `gradient` on `AccentBox` | `gradient-navy` | yes            |

The deprecated values keep working and log a deprecation warning, but will be
removed in a future release. A codemod rewrites every row that looks the same.
`Avatar`'s and `AccentBox`'s `green` stay for you to decide.

`navy`, `sage` and `salmon` are new on `Avatar`, `Icon` and `Color`; `sage` and
`salmon` are new on `Badge` and `AccentBox`. `AccentBox` has one brand gradient
per decorative color: `gradient-navy`, `gradient-sage`, `gradient-lilac` and
`gradient-salmon`. The old `gradient` renders as `gradient-navy`, which replaces
its radial look. On every colored `AccentBox` background (the decorative colors,
`green` and the gradients), content now defaults to `color="dark"`. Dynamic
initials in `Avatar` now pick from all five decorative colors, so a person may
get a different color than before.

The CSS classes and the design tokens of the deprecated values are renamed or
removed **without** a fallback — update them by hand if you use
`@mittwald/flow-stylesheet` or the token CSS variables directly.
