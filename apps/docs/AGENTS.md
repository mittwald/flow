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
- **No pop-culture or Star Wars references in example content.** Use neutral,
  realistic content from the mittwald domain (hosting products, projects,
  members/roles, prices, component props) — see the existing `table/examples`
  for the tone. Star Wars-flavoured fixtures are fine in Storybook stories, but
  never in the docs.
- **Internal links are checked in CI.** `pnpm nx test:links docs` validates
  every `/pathname` and `#anchor` in the content and in the app's own sources
  against the pages that exist — it runs as part of `pnpm affected:test`, so a
  link to a moved or renamed page fails the PR. Move a page and the failure
  names the candidates it could mean. External URLs are out of scope.
- Run `pnpm format` (Prettier, 80-character prose wrap) before committing. The
  local dev server is `pnpm nx dev docs`.
