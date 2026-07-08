# AGENTS.md — icons (icons, icons-base, icons-pro)

Package-specific notes for the icon packages. See the
[root AGENTS.md](../../AGENTS.md) for monorepo-wide commands and
conventions.

## How the three packages relate

- `icons-base` (`@mittwald/flow-icons-base`, private) is the shared source of
  truth: `src/icons.yaml` (icon manifest) plus `definitions.ts`,
  `generate.ts`, `template.ts`. It exposes `./icons.yaml` as a package export
  so downstream packages can read the manifest directly.
- `icons` (`@mittwald/flow-icons`) is the default iconset, built on
  `@tabler/icons-react`.
- `icons-pro` (`@mittwald/flow-icons-pro`) adds FontAwesome Sharp Regular
  icons (`@fortawesome/*`) on top of Tabler.
- Both `icons` and `icons-pro` independently codegen their own React icon
  components from `icons-base` via `build:icons`
  (`tsx src/dev/generate.ts`), then compile with `tsc -p tsconfig.build.json`.
- `components` depends on `icons` directly and `icons-pro` only as an
  optional peer dependency.

## Working with icons

- To add or change an icon: edit `icons-base` (`src/icons.yaml` and/or the
  generator templates), then re-run `build:icons` in **both** `icons` and
  `icons-pro` to regenerate their React components.
- `clean` in `icons`/`icons-pro` removes `dist` and the generated
  `src/components/*` — those directories are entirely code-generated, don't
  hand-edit files there.
