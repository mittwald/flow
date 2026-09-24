# apps/docs — Agent Guide

Next.js documentation site for the flow Styleguide, deployed to
<https://flow.mittwald.de>. See the [root AGENTS.md](../../AGENTS.md).

- **Before writing or changing any Styleguide content, read
  [README.md](README.md)** — it is the canonical content guideline and defines
  the section and page structures, heading conventions, tone of voice, and
  language rules (German content, English Design System terminology).
- Content lives in `src/content` as MDX, one directory per section
  (`get-started`, `foundations`, `patterns`, `components`). A component page is
  a single `index.mdx` — the former `overview`, `develop` and `guidelines` tabs
  are consolidated onto it. Their routes under
  `src/app/(docs)/components/[group]/[component]/` are `redirect()`-only, kept
  so existing links (and their fragments) keep working.
- **Directory names are the public URL**, and they carry no order. The authored
  order lives in `src/lib/content/contentOrder.ts` — a flat list of pathnames
  that the navigation, the header, `llms.txt` and the sitemap all sort by.
  Unlisted entries sort alphabetically by label (the components, deliberately).
  `contentOrder.node.test.ts` rejects a stale entry and a group that lists only
  some of its children; the latter is the silent half-ordered case.
- The sections lost their `NN-` prefixes, so `nginx.conf` carries a `rewrite`
  that strips such a prefix from any segment and 301s. Old links keep working —
  do not write new ones against the old paths.
- **Two root layouts.** `src/app/(docs)` is the Styleguide (header, navigation,
  footer); `src/app/(preview)` renders an App Shell alone, which is what the
  "Vorschau" link on a Template page opens in a new tab. Route groups do not
  appear in the URL, so a page belongs in one of the two — a `page.tsx` directly
  under `src/app` has no layout at all. `buildPageInventory` strips the group
  from the pathname; keep that in mind when adding a group.
- Code examples are `.tsx` files in the `examples/` directory next to the MDX
  file, referenced via `example="<name>"` (see "Page Building Blocks" in the
  README). Every example keeps its imports — they are what the editor builds its
  scope from — but the editor strips them before showing the code.
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
- **CSS-module class names are typed, and the types are generated.**
  `pnpm nx build:scss-types docs` writes a committed `*.module.d.scss.ts` /
  `*.module.d.css.ts` next to every CSS module (shared generator, see the root
  [Generated code](../../AGENTS.md#generated-code--must-be-committed) table).
  Without them Next types every module as `{ readonly [key: string]: string }`,
  so `styles.typo` and a key from the wrong module both type-check and render as
  `undefined` — silently, with no `className` and no error anywhere. Add, rename
  or remove a class and the declaration has to be regenerated and committed, or
  CI's `git diff --exit-code` fails. `allowArbitraryExtensions` in
  `tsconfig.json` is what makes TypeScript prefer them over Next's ambient
  wildcard — remove it and every declaration goes inert without a single error.
- **Two test runners, two globs.** `test:unit` is Vitest over `*.test.ts`;
  `test:links` is the `node:test` runner over `*.node.test.ts`. Neither can
  execute the other's files, so the `.node` infix is what keeps the globs
  disjoint — same role as `*.browser.test.tsx` in `components`. Write a new
  `node:test` file with the infix, or both targets break at once.
- **`pnpm nx test:compile docs` type-checks the app** (`tsc --noEmit`) and runs
  in CI via `affected:test`. It depends on `^build`, `build:imports` and
  `build:scss-types`, so it sees freshly built workspace packages, the generated
  `dynamicImports.ts` and fresh CSS-module stubs. `build:imports` therefore has
  to declare its output — its result is gitignored, so on a cache hit nx only
  restores it if it is listed in `outputs`, and `getDynamicComponent.ts` fails
  as TS2307 otherwise.
- **`types.d.ts` carries Next's ambient types** next to the MDX globals
  (`LiveCodeEditor`, `Do`, `Dont`, …), via `/// <reference types="next" />` and
  `/// <reference types="next/image-types/global" />`. Next writes the same two
  directives to `next-env.d.ts`, but that file is generated and gitignored, so
  it is absent in a fresh CI checkout — without the committed stand-in every
  `.png`/`.webp` import in `src/app/page.tsx` fails as TS2307.
- **Next 16 differs from what a model was trained on** — APIs, conventions and
  file structure moved. Read the relevant guide in
  `node_modules/next/dist/docs/` (resolved from this directory; in this monorepo
  `next` is not visible from the repo root) before writing Next code.
  `next dev`'s own managed AGENTS.md block is off — see `agentRules` in
  `next.config.js`.
- Run `pnpm format` (Prettier, 80-character prose wrap) before committing. The
  local dev server is `pnpm nx dev docs`.
