---
since: 1.7.0
title: "Charts: categorical colors follow Flow's own palette"
kind: migration
action: codemod
remotePackage: true
apply:
  On `Area`, `Bar`, `Line` (imported, or as members of what
  `typedCartesianChart()` returns, e.g. `CartesianChart.Area`) and `LegendItem`,
  rename the `color` values by their slot in the old default order, `sea-green`
  to `indigo`, `palatinate-blue` to `amber`, `tangerine` to `teal`, `magenta` to
  `violet`, `tropical-indigo` to `berry`, `malachite` to `green`, `azure` to
  `blue`, `yellow` to `cyan`, `alloy-orange` to `plum` and `lime` to `red`. Do
  the same for the `color` of each segment in the `segments` of `DonutChart` and
  `ProgressBar`. The codemod rewrites segments in an array literal passed to
  `segments`, and in a `const` array literal in the same file that is used only
  as `segments` of those components; an array built elsewhere (imported,
  computed, or shared with other code) is yours to rename. Keep `violet` and
  `green`, which stay valid names but render new colors. If a chart used both
  `magenta` and `violet`, or both `malachite` and `green`, two series now share
  one color; pick another value for one of them (`rose` and `olive` are free).
  Where `color` held a CSS color name that is now a categorical value (`indigo`,
  `teal`, `blue`, `cyan`, `plum`, `olive`, `red`), it now renders the
  categorical color; use a hex value to keep the CSS color. If you use the token
  CSS variables or the token JSON directly, rename `--categorical--color--<old>`
  to `--categorical--color--<new>` and `categorical.color.<old>` to
  `categorical.color.<new>` with the same mapping; the old names are removed
  without a fallback.
---

Flow's charts use their own 12 categorical colors instead of React Spectrum's,
with separate light and dark values. In default order: `indigo`, `amber`,
`teal`, `violet`, `berry`, `green`, `blue`, `rose`, `cyan`, `plum`, `olive`,
`red`. They apply to the `color` of `Area`, `Bar`, `Line` and `LegendItem`, and
to the segment colors of `DonutChart` and `ProgressBar`.

```diff
- <CartesianChart.Area dataKey="Mail" color="palatinate-blue" />
+ <CartesianChart.Area dataKey="Mail" color="amber" />
```

Each deprecated value maps to the new value in its slot of the default order,
not to the closest hue. A chart that leaves its first series on the default and
sets the second to `palatinate-blue` keeps two different colors that way.

| Deprecated        | Use instead |
| ----------------- | ----------- |
| `sea-green`       | `indigo`    |
| `palatinate-blue` | `amber`     |
| `tangerine`       | `teal`      |
| `magenta`         | `violet`    |
| `tropical-indigo` | `berry`     |
| `malachite`       | `green`     |
| `azure`           | `blue`      |
| `yellow`          | `cyan`      |
| `alloy-orange`    | `plum`      |
| `lime`            | `red`       |

The deprecated values keep working, render as their replacement and log a
deprecation warning; they will be removed in a future release. A codemod
rewrites them. `violet` and `green` keep their names. None of the values looks
the same as before: every color, the kept ones included, changes in light and
dark mode.

The default color of `Area`, `Bar` and `Line` changes from `sea-green` to
`indigo`, matching the mapping above. A chart that set `magenta` next to
`violet`, or `malachite` next to `green`, now shows two series in one color:
choose another value for one of them, for example `rose` or `olive`.

`indigo`, `teal`, `blue`, `cyan`, `plum`, `olive` and `red` are also CSS color
names. A `color` set to one of them used to render the CSS color and now renders
the categorical one.

The CSS variables `--categorical--color--<old>` and the token JSON keys
`categorical.color.<old>` are renamed to their replacement **without** a
fallback — update them by hand if you use the tokens directly.
