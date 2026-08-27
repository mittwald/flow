# apps/docs — Agent Guide

Next.js documentation site for the flow Styleguide, deployed to
<https://flow.mittwald.de>. See the [root AGENTS.md](../../AGENTS.md).

- **Before writing or changing any Styleguide content, read
  [README.md](README.md)** — it is the canonical content guideline and defines
  the section and page structures, heading conventions, tone of voice, and
  language rules (German content, English Design System terminology).
- Content lives in `src/content` as MDX, one directory per section
  (`01-get-started`, `02-foundations`, `03-patterns`, `04-components`). A
  component page is a single `index.mdx` — the former `overview`, `develop` and
  `guidelines` tabs are consolidated onto it. Their routes under
  `src/app/04-components/[group]/[component]/` are `redirect()`-only, kept so
  existing links (and their fragments) keep working.
- Code examples are `.tsx` files in the `examples/` directory next to the MDX
  file, referenced via `example="<name>"` (see "Page Building Blocks" in the
  README).
- **No pop-culture or Star Wars references in example content.** Use neutral,
  realistic content from the mittwald domain (hosting products, projects,
  members/roles, prices, component props) — see the existing `table/examples`
  for the tone. Star Wars-flavoured fixtures are fine in Storybook stories, but
  never in the docs.
- Run `pnpm format` (Prettier, 80-character prose wrap) before committing. The
  local dev server is `pnpm nx dev docs`.
