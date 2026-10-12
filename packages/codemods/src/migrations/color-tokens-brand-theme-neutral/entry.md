---
since: 1.5.0
title: "Color tokens: Brand variables no longer switch with the theme"
kind: migration
action: manual
remotePackage: false
apply:
  Search your own CSS, SCSS and TS for `var(--color--`. Replace the moved
  variables by name — `--color--categorical--X` → `--categorical--color--X`,
  `--color--code-syntax--X` → `--code-syntax--color--X`, `--color--transparent`
  → `--transparent--color`, `--color--gradient` → `--gradient--color`,
  `--color--background-gradient` → `--background-gradient--color`,
  `--color--static-black-alpha--N` → `--dark-static--color--N`,
  `--color--static-white-alpha--N` → `--light-static--color--N`; JavaScript
  reading `color.categorical` from the token JSON reads `categorical.color`.
  Every other `--color--<ramp>--N` (e.g. `--color--gray--100`,
  `--color--hosting-blue--800`) still exists but keeps its light value in dark —
  replace it with the Semantic variable that carries its meaning, e.g.
  `--neutral--color--N` for gray, `--primary--color--N` for hosting-blue,
  `--danger--`, `--warning--` or `--success--color--N` for the status hues, or a
  Variant variable such as `--primary-solid-background-color--default`. Which
  one fits is not decidable mechanically — decide whether the color is a
  surface, content or status.
---

The color tokens now follow four tiers: **Brand** (the palette), **Semantic**
(colors with a meaning), **Variant** (pairs per variant) and component tokens
([ADR 0007](https://github.com/mittwald/flow/blob/main/docs/adr/0007-color-token-tiers.md)).
Only Semantic switches between light and dark. Brand is theme-neutral: one value
per token, the light one.

Flow's own components render exactly as before. What changes is code outside
Flow that reads Brand variables (`--color--…`) directly:

- **`--color--<ramp>--N` no longer inverts in dark.** `var(--color--gray--100)`
  is white in both themes now, where it used to be near-black in dark. Nothing
  fails — the color is just wrong in dark.
- **Some variables moved to Semantic** and their old names are gone:

| Before                           | After                          |
| -------------------------------- | ------------------------------ |
| `--color--categorical--<name>`   | `--categorical--color--<name>` |
| `--color--code-syntax--<name>`   | `--code-syntax--color--<name>` |
| `--color--transparent`           | `--transparent--color`         |
| `--color--gradient`              | `--gradient--color`            |
| `--color--background-gradient`   | `--background-gradient--color` |
| `--color--static-black-alpha--N` | `--dark-static--color--N`      |
| `--color--static-white-alpha--N` | `--light-static--color--N`     |

The same applies to `@mittwald/flow-design-tokens/json*/all-*.json` and
`useDesignTokens()`: `color.categorical` is `categorical.color` now.

```diff
- .card { background: var(--color--gray--100); }
+ .card { background: var(--neutral--color--100); }
```

No codemod: whether `--color--gray--100` meant a surface or content is not
decidable mechanically. Prefer a component token or a Variant variable over a
Semantic one where one fits. Token names and values are outside the semver
contract (ADR 0005), so this ships as a Minor.
