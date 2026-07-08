# @mittwald/flow-icons-base — Agent Guide

Private icon source + shared generator tooling. See the
[root AGENTS.md](../../AGENTS.md).

- `src/icons.yaml` is the **single source of truth** for all icon sets. An
  icon defines a `category`, vendor names (`tb` = Tabler, `fa` = FontAwesome)
  and/or a custom `svg`.
- Generated outputs (all committed, never hand-edited):
  - `packages/icons/src/components/*` — default set (Tabler)
  - `packages/icons-pro/src/components/*` — pro set (FontAwesome sharp-regular)
  - `packages/components/src/components/Icon/components/icons/*`
- Adding/updating an icon: edit `src/icons.yaml`, then regenerate and commit:
  `pnpm nx build:icons icons && pnpm nx build:icons icons-pro && pnpm nx build:icons components`
  (or simply `pnpm build`).
