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
  `--color--soft-contrast-violet--N`, `--color--bright-lilac--N`,
  `--color--super-teal--N`, `--color--amaranth-red--N`,
  `--color--royal-orange--N` and `--color--espelkamp-green--N` resolve to
  nothing, and `--color--mittwald-navy--N` holds the new brand values. Replace
  each with the Semantic variable that carries its meaning, e.g.
  `--elevation--color--N` for a gray surface, `--content--color--N` for gray
  text, `--neutral--color--quiet--N` or `--neutral--color--strong--100` for a
  gray border, `--primary--color--quiet--N` or `--primary--color--strong--N` for
  hosting-blue, `--decorative-<hue>--color--…` for navy, lilac and teal,
  `--danger--`, `--warning--` or `--success--color--…` for the status hues
  (amaranth-red, royal-orange, espelkamp-green), `--dark--color--…` or
  `--light--color--…` for `--color--black-alpha--N` or
  `--color--white-alpha--N`, or a Variant variable such as
  `--primary-solid-background-color--default`. Do the same for every remaining
  Brand variable (`--color--mittwald-*`, `--color--system-*`, the alpha ramps),
  because Brand keeps its light value in dark. Then rename the Semantic
  variables you use. Colored and alpha groups (`primary`, `info`, `success`,
  `danger`, `warning`, `neutral`, `unavailable`, `decorative-*`, `dark`,
  `light`, `dark-static`, `light-static`) keep six tones —
  `--<group>--color--100/200/300` → `--<group>--color--quiet--100/200/300`,
  `--<group>--color--800/900/1000` → `--<group>--color--strong--100/200/300`
  (alpha groups map `800/700/600` → `strong--100/200/300`); the other steps are
  gone, use the nearest tone. Gray from `--neutral--color--N` moves by role —
  surfaces 100–300 → `--elevation--color--100/200/300`, text and icons →
  `--content--color--100` (secondary), `--200` (label) or `--300` (text), on a
  solid surface `--content--color--inverse`, borders →
  `--neutral--color--quiet--100` (grouping), `--quiet--200` (separator) or
  `--strong--100` (control), disabled →
  `--unavailable--color--quiet--100/200/300` (surface, border, content).
  `--decorative-violet--color--…` → `--decorative-lilac--color--…`,
  `--decorative-teal--color--…` → `--decorative-green--color--…`,
  `--decorative-red--`, `--decorative-green--` and
  `--decorative-orange--color--…` → `--danger--`, `--success--` and
  `--warning--color--…`. Which one fits is not decidable mechanically — decide
  whether the color is a surface, content or status.
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
  `--color--bright-lilac--N`, `--color--super-teal--N` and the status ramps
  `--color--amaranth-red--N`, `--color--royal-orange--N` and
  `--color--espelkamp-green--N` no longer exist; `--color--mittwald-navy--N` and
  the alpha ramps carry new values and steps. Nothing fails — the declaration is
  just dropped or the color is different.
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

**Semantic has named roles.** Semantic no longer mirrors a ramp with 11 or 12
steps; it selects few tones per role and theme
([#3455](https://github.com/mittwald/flow/issues/3455)):

| Group                                                                                           | Keys                                                                         |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `primary`, `info`, `success`, `danger`, `warning`, `neutral`, `unavailable`, `decorative-<hue>` | `quiet--100/200/300` (was 100–300), `strong--100/200/300` (was 800/900/1000) |
| `dark`, `light`, `dark-static`, `light-static`                                                  | `quiet--100/200/300`, `strong--100/200/300` (was 800/700/600)                |
| `elevation` (new: raised, ground, inset surface)                                                | `100/200/300`                                                                |
| `content` (new: secondary, label, text; content on strong)                                      | `100/200/300`, `inverse`                                                     |

The decorative groups follow the brand colors: `decorative-blue`, `-navy`,
`-green` (`mittwald-green`), `-lilac` and `-orange` (`mittwald-orange`).
`decorative-violet` and `decorative-teal` are gone (use `-lilac` and `-green`),
and so are `decorative-red`, `-green` and `-orange` as status mirrors (use
`danger`, `success` and `warning`).

```diff
- .card { background: var(--color--gray--100); }
+ .card { background: var(--elevation--color--100); }
- .hint { color: var(--neutral--color--700); }
+ .hint { color: var(--content--color--100); }
- .badge { background: var(--primary--color--100); color: var(--primary--color--900); }
+ .badge { background: var(--primary--color--quiet--100); color: var(--primary--color--strong--200); }
```

No codemod: whether `--color--gray--100` meant a surface or content is not
decidable mechanically. Prefer a component token or a Variant variable over a
Semantic one where one fits. Token names and values are outside the semver
contract (ADR 0005), so this ships as a Minor.
