# apps/docs — Agent Guide

Next.js documentation site for the flow Styleguide, deployed to
<https://flow.mittwald.de>. See the [root AGENTS.md](../../AGENTS.md).

- **Before writing or changing any Styleguide content, read
  [README.md](README.md)** — it is the canonical content guideline and defines
  the section and tab structures, heading conventions, tone of voice, and
  language rules (German content, English Design System terminology).
- Content lives in `src/content` as MDX, one directory per section
  (`01-get-started`, `02-foundations`, `03-patterns`, `04-components`).
  Component pages consist of `index.mdx`, `overview.mdx`, `develop.mdx`, and
  `guidelines.mdx`.
- Code examples are `.tsx` files in the `examples/` directory next to the MDX
  file, referenced via `example="<name>"` (see "Page Building Blocks" in the
  README).
- Run `pnpm format` (Prettier, 80-character prose wrap) before committing. The
  local dev server is `pnpm nx dev docs`.
