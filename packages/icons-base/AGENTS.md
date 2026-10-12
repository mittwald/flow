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
- Generated outputs (all committed, never hand-edited):
  - `packages/icons/src/components/*` — default set (Tabler)
  - `packages/icons-pro/src/components/*` — pro set (FontAwesome sharp-regular)
  - `packages/components/src/components/Icon/components/icons/*`
- Adding/updating an icon: edit `src/icons.yaml`, then regenerate and commit:
  `pnpm nx build:icons icons && pnpm nx build:icons icons-pro && pnpm nx build:icons components`
  (or simply `pnpm build`).
