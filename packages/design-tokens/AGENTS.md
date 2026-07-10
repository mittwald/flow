# @mittwald/flow-design-tokens — Agent Guide

Design tokens for mittwald Flow. See the [root AGENTS.md](../../AGENTS.md).

- The YAML files are the **source of truth**, defined together with UX —
  **design authority**. **Base tokens** (top-level files: colors, font,
  size, border, …) are taboo — never add or change them on your own.
  Adding **component tokens** for a new component (category files like
  `src/actions/button.yml`) is fine — model them on existing components
  and ask when unsure.
- `node build-tokens.js` (nx target `build`) compiles them with
  [style-dictionary](https://styledictionary.com/) to `dist/css/*` (CSS
  variables; theme variants keyed by `data-theme`) and `dist/json/*`.
- Consumers: `components` SCSS uses the CSS variables; some runtime helpers
  (e.g. categorical chart colors) read the JSON output.
