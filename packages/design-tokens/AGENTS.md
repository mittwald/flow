# @mittwald/flow-design-tokens — Agent Guide

Design tokens for mittwald Flow. See the [root AGENTS.md](../../AGENTS.md).

- The YAML files are the **source of truth**, defined together with UX —
  **design authority**. **Base tokens** (top-level files: colors, font, size,
  border, …) are taboo — never add or change them on your own. Adding
  **component tokens** for a new component (category files like
  `src/actions/button.yml`) is fine — model them on existing components and ask
  when unsure.
- **Color tiers** follow [ADR 0007](../../docs/adr/0007-color-token-tiers.md):
  `color-brand.yml` (palette, theme-neutral, literals only) →
  `color-semantic.{light,dark}.yml` (the only light/dark switch, references
  Brand) → `color-variant.yml` (references Semantic) → component files (never
  Brand). The build emits Semantic per theme (`colors-*.css`) and everything
  else once (`base.css`). `build-tokens.js` fails on a forbidden reference, a
  literal outside the Semantic literal groups, or a Semantic key missing in one
  theme.
- **`rem` vs `px` for size tokens.** Use `{size-rem.*}` for anything that should
  scale with the user's font size — spacing that must stay proportional to text
  (heading-to-text, icon-to-text, label gaps) and controls sized relative to
  text (checkbox, radio, slider, rating). Use `{size-px.*}` for values that stay
  fixed regardless of font size — border widths, focus-ring offsets, a
  component's general inner padding. In doubt: does it sit next to text and need
  to keep visual balance as the text grows? → `rem`.
- `node build-tokens.js` (nx target `build`) compiles them with
  [style-dictionary](https://styledictionary.com/) to `dist/css/*` (CSS
  variables; theme variants keyed by `data-theme`), `dist/json/*` and
  `dist/json-runtime/*`.
- **`json` vs. `json-runtime`.** Both hold the same tokens with the same values,
  in the same nested shape. `json` is style-dictionary's full output — every
  token carries its build metadata (`filePath`, `isSource`, `original`,
  `attributes`, …), which dwarfs the values themselves and makes the file
  roughly an order of magnitude larger. `json-runtime` keeps only `value` and
  `path`. **Anything that reaches a browser bundle imports `json-runtime`** —
  `json` is for build-time and tooling, where the metadata is the point. A
  `no-restricted-imports` rule in [eslint.config.js](../../eslint.config.js)
  enforces this for every `src/`, so build-time code that genuinely needs
  `original` (the unresolved reference, which most tokens have) has to live
  outside `src/`.
- **Contrast audit.** `pnpm nx audit:contrast tokens` builds the tokens and
  reports WCAG 2.2 AA ratios in light and dark (`--all`, `--json`, `--strict`
  after `--`). Two sources, both in `dev/contrast-audit-lib.js`:
  - **Pairs from token names.** A `…content-color`, `…icon-color` or `color`
    token pairs with the sibling named `…background-color`, per state. Name a
    new pair that way and the audit picks it up.
  - **Single colors on surfaces.** Content without a background sibling (`text`,
    `heading`, `link`, `icon`, `alert-text`, form-field borders, focus ring, …)
    is listed in `SURFACE_CONTENT` and rated on the backgrounds it renders on
    (`CONTENT_SURFACES`, `STATE_SURFACES`). A new container with its own
    background, or a new content-only color, belongs in those lists.
  - **Backdrops.** Translucent backgrounds are composited on the theme surface
    (`elevation.color.100`); `light`/`*-static` colors on an ideal backdrop.
- **Contrast gate.** `pnpm nx test:contrast tokens` (part of `pnpm test` and
  CI's `affected:test`) fails on any failure not in
  `dev/contrast-audit-allowlist.js`, on an allowlisted pair that drops below its
  recorded ratio, and on an allowlisted pair that passes now. Fix colors rather
  than extend the list; when a failure is known and accepted, add the line the
  gate prints to the group with its cause, or a new group with a reason and the
  ticket that fixes it. Delete entries as they pass.
- Consumers: `components` SCSS uses the CSS variables; some runtime helpers
  (e.g. `useDesignTokens`, categorical chart colors) read `json-runtime`.
