---
since: 1.5.0
title:
  "Color tokens: a new Brand palette that no longer switches with the theme"
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
  reading `color.categorical` from the token JSON reads `categorical.color`. The
  old palettes are gone — `--color--gray--N`, `--color--hosting-blue--N`,
  `--color--soft-contrast-violet--N`, `--color--bright-lilac--N` and
  `--color--super-teal--N` resolve to nothing, and `--color--mittwald-navy--N`
  holds the new brand values. Replace each with the Semantic variable that
  carries its meaning, e.g. `--neutral--color--N` for gray,
  `--primary--color--N` for hosting-blue, `--decorative-<hue>--color--N` for
  navy, violet, lilac and teal, `--danger--`, `--warning--` or
  `--success--color--N` for the status hues, `--dark--color--N` or
  `--light--color--N` for `--color--black-alpha--N` or
  `--color--white-alpha--N`, or a Variant variable such as
  `--primary-solid-background-color--default`. Do the same for every remaining
  Brand variable (`--color--mittwald-*`, `--color--system-*`, the alpha and
  status ramps), because Brand keeps its light value in dark. Which one fits is
  not decidable mechanically — decide whether the color is a surface, content or
  status.
---

The color tokens now follow four tiers: **Brand** (the palette), **Semantic**
(colors with a meaning), **Variant** (pairs per variant) and component tokens
([ADR 0007](https://github.com/mittwald/flow/blob/main/docs/adr/0007-color-token-tiers.md)).
Only Semantic switches between light and dark. Brand is theme-neutral: one value
per token, the light one.

Brand now holds the new mittwald brand palette (`mittwald-blue`, `-navy`,
`-green`, `-lilac`, `-orange`, `-neutral`, `system-danger`, `-warning`,
`-success`; hue ramps with 19 steps, alpha ramps with 10). Flow's own components
pick it up through Semantic. What breaks is code outside Flow that reads Brand
variables (`--color--…`) directly:

- **The old palettes are removed.** `--color--gray--N`,
  `--color--hosting-blue--N`, `--color--soft-contrast-violet--N`,
  `--color--bright-lilac--N` and `--color--super-teal--N` no longer exist;
  `--color--mittwald-navy--N` and the alpha ramps carry new values and steps.
  Nothing fails — the declaration is just dropped or the color is different.
- **Brand no longer inverts in dark.** A remaining `--color--<ramp>--N` keeps
  its light value in both themes.
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
