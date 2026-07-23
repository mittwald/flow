# @mittwald/flow-design-tokens — Agent Guide

Design tokens for mittwald Flow. See the [root AGENTS.md](../../AGENTS.md).

- The YAML files are the **source of truth**, defined together with UX —
  **design authority**. **Base tokens** (top-level files: colors, font, size,
  border, …) are taboo — never add or change them on your own. Adding
  **component tokens** for a new component (category files like
  `src/actions/button.yml`) is fine — model them on existing components and ask
  when unsure.
- **`rem` vs `px` for size tokens.** Use `{size-rem.*}` for anything that should
  scale with the user's font size — spacing that must stay proportional to text
  (heading-to-text, icon-to-text, label gaps) and controls sized relative to
  text (checkbox, radio, slider, rating). Use `{size-px.*}` for values that stay
  fixed regardless of font size — border widths, focus-ring offsets, a
  component's general inner padding. In doubt: does it sit next to text and need
  to keep visual balance as the text grows? → `rem`.
- `node build-tokens.js` (nx target `build`) compiles them with
  [style-dictionary](https://styledictionary.com/) to `dist/css/*` (CSS
  variables; theme variants keyed by `data-theme`) and `dist/json/*`.
- Consumers: `components` SCSS uses the CSS variables; some runtime helpers
  (e.g. categorical chart colors) read the JSON output.
