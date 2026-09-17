# @mittwald/flow-icons-base — Agent Guide

Private icon source + shared generator tooling. See the
[root AGENTS.md](../../AGENTS.md).

- `src/icons.yaml` is the **single source of truth** for all icon sets. An icon
  defines a `category`, vendor names (`tb` = Tabler, `fa` = FontAwesome) and/or
  a custom `svg`.
- **Tabler icons are inlined, not imported.** `src/tabler.ts` reads each icon's
  path data out of `@tabler/icons-react` at generation time and the template
  writes it into the generated component, which renders it through
  `packages/icons/src/lib/createTablerIcon.ts` — a copy of Tabler's own
  `createReactComponent`. `@tabler/icons-react` is therefore a **dev**
  dependency; consumers no longer install it (74 MB, ~24,000 files). The
  rendered `<svg>` is unchanged, `tabler-icon` classes included.
- **Bumping `@tabler/icons-react` does not update the icons by itself** — the
  path data is a committed artifact. Regenerate and commit, like every other
  generator here; `build:icons` lists `pnpm-lock.yaml` as an nx input so the
  bump invalidates its cache.
- FontAwesome stays imported at runtime: `packages/icons-pro` generates against
  `@fortawesome/sharp-regular-svg-icons`, a **Pro** package each consumer
  licenses itself. Inlining those path data would redistribute Pro assets.
- **`getIconSources()` is the framework-agnostic export** (`src/sources.ts`):
  the default set as data — Tabler path data, custom SVG parsed into a node tree
  — with no React in it. `packages/remote-vue-components` generates its Vue
  icons from it; a third binding should too, rather than re-reading
  `icons.yaml`. The **pro** set is deliberately absent: its path data would have
  to be inlined from a Pro package, which is the one thing the licence forbids.
- **`parseSvg()` turns the custom `svg:` markup into data** (`src/svg.ts`), and
  is strict: it understands elements, double-quoted attributes and whitespace,
  and throws on anything else. It also gives React's attribute spellings back
  their SVG ones — `strokeWidth` → `stroke-width` — against a list of the names
  that are camelCase in SVG itself. Getting that backwards is silent: the
  browser ignores an attribute it does not know, and the icon renders unstyled.
  `src/svg.test.ts` pins both halves; run it with
  `pnpm nx test:unit icons-base`.
- Generated outputs (all committed, never hand-edited):
  - `packages/icons/src/components/*` — default set (Tabler)
  - `packages/icons-pro/src/components/*` — pro set (FontAwesome sharp-regular)
  - `packages/components/src/components/Icon/components/icons/*`
  - `packages/remote-vue-components/src/icons/components/*` — the Vue set
- Adding/updating an icon: edit `src/icons.yaml`, then regenerate and commit:
  `pnpm nx run-many -t build:icons` (or simply `pnpm build`).
