# Semantic color tiers in other design systems

Research for [#3451](https://github.com/mittwald/flow/issues/3451), part of the
color token map [#3448](https://github.com/mittwald/flow/issues/3448). Sources
are official docs and source repos, read on 2026-10-12. Values marked _computed_
were derived from the published token data, not stated by the system.

## Answer

All five systems put a semantic tier between the raw palette and components.
They differ in three things:

- **Where light/dark switches.** Material and Atlassian keep the palette
  theme-neutral and switch in the semantic tier. Spectrum and Primer give the
  palette per-theme values _and_ re-pick steps in the semantic tier. Radix ships
  separate light and dark scales whose steps mean the same thing in both modes.
- **How contrast is guaranteed.** Either by construction (Material's tone
  distance, Spectrum's contrast-indexed steps, Radix's APCA-tuned steps) or by a
  CI check over a list of foreground/background pairs (Primer, Atlassian).
- **How status colors fit.** No system derives status colors from brand tones.
  Each status gets its own hue ramp and reuses the same step logic as the brand
  color.

Flow today is structurally closest to Spectrum: per-theme palette with inverted
dark ramps, and a semantic tier that mirrors each ramp 1:1. Spectrum can afford
the mirror because its steps are contrast-indexed. Flow's working idea (Alias 1
= a few tones per theme with roles) is closest to Material's system tier and
Atlassian's theme files.

## Material Design 3

**Tiers (3).** Reference → system → component.

- Reference: `md.ref.palette.*` — concrete values, e.g. `primary40`, `error90`.
  Each key color has a tonal palette with tones 0, 10, 20 … 90, 95, 98, 99, 100
  ([material-web `_md-ref-palette.scss`](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-ref-palette.scss)).
- System: `md.sys.color.*` — roles such as `primary`, `on-primary`,
  `primary-container`, `surface-container-high`.
- Component: tokens assigned to elements; on the web they carry no `comp` prefix
  ([material-web theming](https://material-web.dev/theming/material-theming/)).

**Light/dark switch.** In the system tier. The reference palette is
theme-neutral; each scheme maps roles to different tones. material-web ships
separate sys files per scheme: `_md-sys-color.scss`, `_md-sys-color__dark.scss`,
plus medium- and high-contrast variants
([tokens dir](https://github.com/material-components/material-web/tree/main/tokens/versions/latest/sass)).

**Role naming.** Each accent color gets four roles: `X`, `on-X`, `X-container`,
`on-X-container`. Neutrals provide `surface`, five `surface-container-*` levels,
`on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `inverse-*`.
Plus `X-fixed`/`X-fixed-dim` roles that keep the same tone in both modes. Full
list in
[`material_dynamic_colors.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/material_dynamic_colors.ts).
Every role has a paired content role ("All tokens have a corresponding
`--md-sys-color-on-<token>`",
[material-web color docs](https://github.com/material-components/material-web/blob/main/docs/theming/color.md)).

**Few tones → many roles.** One source color → 5 key colors (primary, secondary,
tertiary, neutral, neutral variant) + error → 6 tonal palettes → about 50 roles.
Each role is one tone of one palette. Baseline mapping
([`scheme.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/scheme.ts)):

| Role                   | Light tone              | Dark tone |
| ---------------------- | ----------------------- | --------- |
| `primary`              | 40                      | 80        |
| `on-primary`           | 100                     | 20        |
| `primary-container`    | 90                      | 30        |
| `on-primary-container` | 10                      | 90        |
| `surface`              | 98 (99 in older scheme) | 6 (10)    |
| `on-surface`           | 10                      | 90        |

So an accent color uses four tones per mode. Hover/pressed/focus are not extra
tones: they are state-layer overlays with fixed opacity (hover 0.08, focus 0.1,
pressed 0.1;
[`_md-sys-state.scss`](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-sys-state.scss)).

**Status colors.** Only `error` is built in, with its own tonal palette and the
same four roles. Success/warning are "custom colors": extra source colors,
optionally hue-harmonized toward the primary color
([`blend.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/blend/blend.ts)),
each yielding the same four roles.

**Contrast.** By construction. HCT tone is a perceptual lightness: "A difference
of 40 in HCT tone guarantees a contrast ratio >= 3.0, and a difference of 50
guarantees a contrast ratio >= 4.5"
([`hct.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/hct/hct.ts)).
Dynamic schemes add a per-role `ContrastCurve` — target WCAG ratios at contrast
levels -1, 0, 0.5, 1 — e.g. `on-primary` on `primary` =
`ContrastCurve(4.5, 7, 11, 21)`, `primary` on surface = `(3, 4.5, 7, 7)`
([`color_spec_2021.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts),
[`contrast_curve.ts`](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/contrast_curve.ts)).
The solver moves tones until the target is met.

**Palette theme-neutral?** Yes.

## Adobe Spectrum 2

**Tiers (4 for color).** Source:
[adobe/spectrum-design-data `packages/tokens/src`](https://github.com/adobe/spectrum-design-data/tree/main/packages/tokens/src).

1. Global palette — `color-palette.json`: hue ramps `blue-100` … `blue-1600` (16
   steps), `gray-25` … `gray-1000`, `static-*`, `transparent-*`.
2. Semantic palette — `semantic-color-palette.json`: `accent-color-*`,
   `informative-color-*`, `negative-color-*`, `notice-color-*`,
   `positive-color-*`, each mirroring a hue ramp 1:1 (`accent-color-900` →
   `blue-900`, `negative-*` → `red-*`, `notice-*` → `orange-*`, `positive-*` →
   `green-*`). 5 × 16 steps.
3. Alias — `color-aliases.json`:
   `<role>-<background|content|border|visual>-color-<state>`, e.g.
   `accent-background-color-default`, `negative-content-color-hover`,
   `neutral-subdued-background-color-down`, `background-layer-1-color`.
4. Component — one file per component (`avatar.json`, `button.json`, …). Tiers
   are not strict: component tokens may reference the palette directly
   (`avatar.json` → `{gray-25}`).

**Light/dark switch.** In two places.

- Palette: 301 of 369 palette tokens carry `sets.light` / `sets.dark` /
  `sets.wireframe` values. Ramps are inverted in dark: `gray-25` is
  `rgb(255,255,255)` light and `rgb(17,17,17)` dark; `blue-100` is near-white
  light and `rgb(14,23,63)` dark.
- Alias: 98 of 191 aliases pick a different step per theme, e.g.
  `accent-background-color-default` = `accent-color-900` light,
  `accent-color-800` dark; `*-subtle-background-color-default` = `-200` light,
  `-300` dark.

**Few tones → many roles.** Not reduced. Each semantic role carries the full
16-step ramp; aliases pick steps from it.

**Status colors.** First-class semantic roles: informative, negative, notice,
positive (plus accent, neutral). Same alias pattern as accent.

**Contrast.** By construction: colors are generated with
[Leonardo](https://github.com/adobe/leonardo) from target contrast ratios, so
the step index encodes contrast. Adobe: "all colors with a 900 index can be used
for small text" (4.5:1 against gray-100), 700 for large text and 3:1 UI
([Reinventing Adobe Spectrum's colors](https://adobe.design/stories/design-for-scale/reinventing-adobe-spectrum-s-colors);
that article describes the Spectrum 1 palette with 14 steps). _Computed_ from
the S2 data against `gray-25`: every hue's 700/800/900/1000 has ≈
3.2/4.0/4.8/6.3 in light and ≈ 3.6/4.2/5.4/6.6 in dark — the same ratio for
blue, red, green and orange. That uniformity is what makes the 1:1 semantic
mirror and per-step alias picks safe.

**Palette theme-neutral?** No — per-theme values, inverted ramps.

## GitHub Primer (Primitives)

**Tiers (3).** Source:
[primer/primitives `src/tokens`](https://github.com/primer/primitives/tree/main/src/tokens).

1. Base — `base/color/{light,dark}/*.json5`: `base.color.neutral.0` … `.13` (14
   steps) and hue scales `blue`, `green`, `yellow`, `orange`, `red`, `purple`,
   `pink`, `coral` with steps 0–9.
2. Functional — `functional/color/{fgColor,bgColor,borderColor}.json5`:
   `[property]-[role]-[variant]`, e.g. `fgColor-default`, `fgColor-muted`,
   `fgColor-onEmphasis`, `bgColor-success-muted`, `bgColor-danger-emphasis`,
   `borderColor-accent-emphasis`.
3. Pattern/component — `button-primary-bgColor-rest`, `control-*`,
   `focus-outlineColor`, `overlay-*`
   ([primer.style color docs](https://primer.style/product/primitives/color/)).

**Light/dark switch.** In two places.

- Base: separate light and dark files with different values for the same step.
  The neutral scale is inverted (`neutral.0` = white in light, `#010409` in
  dark); hue scales keep their direction but are retuned (dark `blue.5` =
  `#1f6feb`).
- Functional: one file per property; the light value is the default and every
  other theme is an override in `$extensions['org.primer.overrides']`, e.g.
  `bgColor-default` = `neutral.0` light, `neutral.1` dark.

Themes: light, dark, dark-dimmed, light/dark high-contrast, tritanopia and
protanopia-deuteranopia variants, built as overrides of light or dark
([README](https://github.com/primer/primitives#extending-and-overwriting)).

**Role naming.** Roles: `accent`, `success`, `attention`, `severe`, `danger`,
`done`, `neutral`, `sponsors`, `upsell`, plus GitHub states `open`, `closed`,
`draft` that alias to the status roles (`bgColor-open-muted` →
`bgColor-success-muted`). Two emphasis levels: `muted` and `emphasis`. Text on
an emphasis background uses `fgColor-onEmphasis`.

**Few tones → many roles.** A role typically uses three steps of its hue: `0`
(muted bg, light), `4`–`5` (emphasis bg/border), `5`–`6` (fg).

**Status colors.** Same `muted`/`emphasis` pattern as `accent`. Colorblind
themes remap hues in the functional tier: `bgColor-success-muted` → `blue.0` in
`light-tritanopia`.

**Contrast.** By CI check. `scripts/colorContrast.config.ts` lists
foreground/background token pairs; required ratios are 4.5 (text) / 3 (border),
and 7 / 4.5 in high-contrast themes. The
[`a11y-contrast.yml`](https://github.com/primer/primitives/blob/main/.github/workflows/a11y-contrast.yml)
workflow builds tokens, runs the check, comments results on the PR and fails on
a breach.

**Palette theme-neutral?** No — per-mode base files.

## Radix Colors (and Radix Themes)

**Tiers.** Radix Colors is one tier: 12-step scales. It recommends aliases on
top but ships none
([aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)). Radix
Themes adds one alias tier: `--accent-1` … `--accent-12`, `--gray-1` …
`--gray-12`, plus `--accent-contrast`, `--accent-surface`, `--color-background`,
`--color-panel-solid`, `--color-surface`, `--color-overlay`
([Themes color](https://www.radix-ui.com/themes/docs/theme/color)).

**Role naming.** The step _is_ the role
([understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)):

| Steps | Use                                                          |
| ----- | ------------------------------------------------------------ |
| 1–2   | App background, subtle background                            |
| 3–5   | UI element background: normal, hover, active/selected        |
| 6–8   | Subtle borders, UI element border + focus ring, hover border |
| 9–10  | Solid background, hovered solid background                   |
| 11–12 | Low-contrast text, high-contrast text                        |

**Light/dark switch.** In the palette. Each scale ships as a light and a dark
file (`blue.css`, `blue-dark.css`); `.dark` swaps the values
([usage](https://www.radix-ui.com/colors/docs/overview/usage)). Step semantics
are identical in both modes, so aliases need no per-mode mapping. For the
exceptions Radix recommends "mutable aliases" remapped under `.dark`.

**Few tones → many roles.** Radix Themes takes two inputs, `accentColor` and
`grayColor`; the accent is "automatically paired with a gray shade". 2 scales ×
12 steps cover all component colors.

**Status colors.** No built-in roles. Aliasing doc: map a role onto a scale
(`--info-1: var(--blue-1)`); Radix Themes components take a `color` prop.

**Contrast.** By construction, APCA: steps 11 and 12 are "guaranteed to Lc 60
and Lc 90 APCA contrast ratio on top of a step 2 background from the same
scale". No WCAG claim.

**Palette theme-neutral?** No in values, yes in meaning: step N means the same
thing in both modes.

## Atlassian Design System

**Tiers (2).** Palette (base tokens) → design tokens. No public component tier.

- Palette: one value per name, e.g. `Blue100` … `Blue1000` (12 steps incl.
  `Blue250`, `Blue850`), `Red`, `Orange`, `Yellow`, `Lime`, `Green`, `Teal`,
  `Purple`, `Magenta`, and two neutral ramps: `Neutral` (light) and
  `DarkNeutral` (dark), with alpha variants (`@atlaskit/tokens@20.4.1`,
  `dist/esm/artifacts/palettes-raw/palette.js`).
- Design tokens: `color.[property].[role].[emphasis].[state]`, e.g.
  `color.background.danger.bold.hovered`
  ([color foundations](https://atlassian.design/foundations/color)). 442 color
  tokens.

**Light/dark switch.** In the token tier. Each theme file maps every token to a
palette name (`dist/esm/artifacts/tokens-raw/atlassian-{light,dark}.js`):

| Token                          | Light         | Dark              |
| ------------------------------ | ------------- | ----------------- |
| `color.text`                   | `Neutral1000` | `DarkNeutral1000` |
| `color.background.brand.bold`  | `Blue700`     | `Blue400`         |
| `color.text.brand`             | `Blue700`     | `Blue400`         |
| `color.background.danger`      | `Red100`      | `Red1000`         |
| `color.background.danger.bold` | `Red700`      | `Red400`          |
| `color.text.danger`            | `Red800`      | `Red300`          |
| `color.border.danger`          | `Red600`      | `Red500`          |

Further themes (increased contrast, brand refresh) are additional theme files
over the same palette.

**Role naming.** Properties `text`, `icon`, `border`, `background`, `link`,
`elevation.surface`. Roles `neutral`, `brand`, `information`, `success`,
`warning`, `danger`, `discovery`, `accent.<hue>`, `inverse`, `input`. Emphasis
from `subtlest` to `boldest`; states `hovered`, `pressed`, `selected`,
`focused`, `disabled`.

**Few tones → many roles.** A role uses roughly six steps of its hue per mode
(e.g. danger light: 100/200 bg, 600 border, 700 bold bg/icon, 800 text, 900
bolder text). The custom-theme feature shows the reduction explicitly: one brand
hex → a 10-step ramp generated in HCT from fixed WCAG contrast targets against
white (`generate-colors.js`), the input replacing its nearest step → mapped to
`color.*.brand.*` tokens by ramp index, with a branch on whether the brand hex
reaches 4.5:1 on white (`generate-token-map.js`).

**Status colors.** First-class roles with the full emphasis × state matrix.
`color.text.warning.inverse` exists because white fails on the yellow/orange
bold background.

**Contrast.** WCAG AA: 4.5:1 for text under 24px, 3:1 for larger text and
essential UI ([color foundations](https://atlassian.design/foundations/color)).
The build generates a list of token pairs with `desiredContrast`
(`dist/esm/artifacts/generated-pairs.js`) used by the custom-theme contrast
checker.

**Palette theme-neutral?** Yes for hues; neutrals are split into a light and a
dark ramp.

## Comparison

| System     | Tiers (color)                         | Light/dark switch                  | Palette theme-neutral        | Brand input → roles                                            | Status colors                                      | Contrast guarantee                           |
| ---------- | ------------------------------------- | ---------------------------------- | ---------------------------- | -------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| Material 3 | ref → sys → comp (3)                  | sys                                | yes                          | 1 source → 6 palettes → ~50 roles; 4 tones per accent per mode | `error` built in; others custom, same 4 roles      | HCT tone distance + per-role `ContrastCurve` |
| Spectrum 2 | palette → semantic → alias → comp (4) | palette values + alias picks       | no (inverted ramps)          | 1 hue ramp per role, 16 steps, mirrored 1:1                    | informative/negative/notice/positive               | Leonardo: step index = contrast              |
| Primer     | base → functional → pattern (3)       | base values + functional overrides | no                           | ~3 steps per role (`muted`, `emphasis`, fg)                    | success/attention/severe/danger; colorblind remaps | CI pair check, 4.5/3 (7/4.5 HC)              |
| Radix      | scale (→ app aliases) (1–2)           | palette (light/dark files)         | values no, meaning yes       | accent + gray → 2 × 12 steps                                   | none; alias any scale                              | APCA Lc 60/90 for steps 11/12 on step 2      |
| Atlassian  | palette → tokens (2)                  | tokens (theme files)               | yes (+ separate DarkNeutral) | ~6 steps per role per mode; custom: 1 hex → 10 steps           | success/warning/danger/information/discovery       | WCAG AA stated; generated pair list          |

## Implications for Flow

Suggestions, not decisions.

1. **Pick one switch point.** Flow switches in Global (dark file inverts the
   ramps), as Spectrum does. If Alias 1 becomes a selection of tones per theme,
   the switch moves to Alias 1 and Global can be theme-neutral — the
   Material/Atlassian model. That matches the map's destination: Global holds
   the brand palette "without deciding how Flow uses it". Switching in both
   tiers (Spectrum, Primer) doubles the places a dark-mode bug can hide.
2. **Dark-only tones can still live in Global.** Atlassian keeps a separate
   `DarkNeutral` ramp in a theme-neutral palette. Flow's Global can do the same
   for dark-specific brand tones.
3. **A 1:1 mirror needs contrast-indexed steps.** Spectrum's mirror works
   because step N has the same contrast in every hue and theme. Flow's Alias 1
   mirror carries no such guarantee. Either drop the mirror (working idea) or
   make steps contrast-indexed; the first fits a fixed brand palette better.
4. **Pair every surface role with a content role.** All five systems do: `on-*`
   (Material), `fgColor-onEmphasis` (Primer), `text.inverse` /
   `text.warning.inverse` (Atlassian), step 9 + `--accent-contrast` (Radix).
   "Three light tones" likely means three surface tones plus their content
   colors. Material's accent uses four tones per mode (color, on-color,
   container, on-container) — a useful upper bound to compare against.
5. **Name roles by emphasis, aligned with Alias 2.** Alias 2 already uses
   `solid`/`soft`/`plain`/`outline`. Alias 1 roles could carry the same emphasis
   vocabulary (e.g. strong ↔ `solid`, subtle ↔ `soft`) instead of step numbers,
   as Primer (`muted`/`emphasis`) and Atlassian (`subtlest`…`boldest`) do.
6. **Status colors stay separate ramps.** No system derives success/warning/
   danger from brand tones. Give each status the same small role set as the
   brand (Flow already uses only steps 100–300 and 800–1000, i.e. ~6 steps).
   Expect a warning exception: yellow/orange solid backgrounds need dark content
   (Atlassian `text.warning.inverse`).
7. **Decide how hover/pressed get their colors.** Spectrum, Atlassian and Radix
   use the next step; Material uses opacity overlays. With only ~3 tones per
   theme, step-based states run out — check how Alias 2 states resolve today
   before fixing the tone count.
8. **Add a contrast check.** Flow has none. Primer's approach is the cheapest to
   copy: a list of content/background token pairs (Alias 2 `*-content-color` on
   `*-background-color`) with 4.5:1 / 3:1 targets, run on the built tokens in
   CI. Atlassian generates the pair list from token names; Flow's
   `<status>-<variant>-<background|content|border>-color` naming allows the
   same.
