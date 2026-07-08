# Contributing to Flow

First off — thank you for taking the time to contribute! 🎉

**Flow** is [mittwald's design system](https://flow.mittwald.de/). This
repository is a monorepo containing the React component library, design tokens,
icon sets, the remote-rendering stack, and the documentation site.

> ⚠️ Flow is in **early development**. APIs may change without notice.
> Contributions are very welcome, but please expect the ground to shift under
> you occasionally.

This guide is for people who want to **work on Flow itself**. If you only want
to _use_ Flow in your own project, you're in the wrong place — head to
[flow.mittwald.de](https://flow.mittwald.de/) instead.

## Table of contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Repository overview](#repository-overview)
- [Development workflow](#development-workflow)
- [Anatomy of a component](#anatomy-of-a-component)
- [Adding or changing a component](#adding-or-changing-a-component)
- [Design tokens & icons](#design-tokens--icons)
- [Testing](#testing)
- [Code style](#code-style)
- [Commit conventions](#commit-conventions)
- [Opening a pull request](#opening-a-pull-request)
- [Releases](#releases)
- [Getting help](#getting-help)

## Prerequisites

| Tool        | Version                                                         |
| ----------- | --------------------------------------------------------------- |
| **Node.js** | `>=20.19` (CI runs on Node 24 — any recent 20.19+ LTS works)    |
| **pnpm**    | `10.28.2` — pinned via the `packageManager` field, use Corepack |
| **Git**     | any recent version                                              |

We use [pnpm](https://pnpm.io/) as the package manager. The easiest way to get
the exact pinned version is [Corepack](https://nodejs.org/api/corepack.html),
which ships with Node.js:

```shell
corepack enable
```

Corepack reads the `packageManager` field in `package.json` and transparently
uses the correct pnpm version.

## Getting started

```shell
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/flow.git
cd flow

# 2. Install dependencies
pnpm install

# 3. Install the local Git hooks (see below)
pnpm dev:init-githooks

# 4. Start the component dev environment (Storybook)
pnpm nx dev components
```

Storybook opens on <http://localhost:6006>. This is where you'll spend most of
your time when developing components.

### Git hooks

`pnpm dev:init-githooks` wires up
[simple-git-hooks](https://github.com/toplenboren/simple-git-hooks). Once
installed:

- **pre-commit** runs `pnpm lint` (ESLint + Stylelint) on your changes.
- **post-checkout** / **post-merge** run `pnpm install && pnpm clean` so your
  dependencies and Nx cache stay in sync after switching branches or pulling.

## Repository overview

Flow is a **pnpm workspace** monorepo orchestrated with [Nx](https://nx.dev/)
(task running & caching) and
[Lerna-Lite](https://github.com/lerna-lite/lerna-lite) (versioning &
publishing).

The packages you're most likely to touch:

| Package                        | npm name                              | What it is                                                |
| ------------------------------ | ------------------------------------- | --------------------------------------------------------- |
| `packages/components` ⭐       | `@mittwald/flow-react-components`     | **The core React component library.** Start here.         |
| `packages/design-tokens`       | `@mittwald/flow-design-tokens`        | Design tokens (colors, spacing, typography) as YAML → CSS |
| `packages/icons` / `icons-pro` | `@mittwald/flow-icons` / `-icons-pro` | The default and pro icon sets                             |
| `packages/stylesheet`          | `@mittwald/flow-stylesheet`           | Plain CSS classes used across Flow                        |
| `apps/docs`                    | `@mittwald/flow-documentation`        | The public documentation site (Next.js + Fumadocs)        |

Supporting packages (touch these only when your change concerns them):

| Package                                | Purpose                                                         |
| -------------------------------------- | --------------------------------------------------------------- |
| `packages/remote-*`                    | The remote-rendering stack (render Flow across iframes/workers) |
| `packages/react-tunnel`                | Render React components through a "tunnel" (portal-like)        |
| `packages/ext-bridge`, `mstudio-ext-*` | Building blocks for mStudio embedded extensions                 |
| `packages/codemods`                    | Codemods to help consumers migrate between versions             |
| `packages/typescript-config`           | Shared TypeScript config                                        |

## Development workflow

Nx runs the scripts of each package as **targets**. The general shape is
`pnpm nx <target> <project>`:

```shell
pnpm nx dev components      # Storybook for the component library (port 6006)
pnpm nx dev docs            # the documentation site (Next.js)
pnpm nx build components    # build a single package
pnpm build                  # build everything (except docs)
```

A few things worth knowing:

- **Nx caches** target results and only rebuilds what changed. If something
  seems stale, `pnpm clean` (which runs `nx reset` + each package's `clean`)
  resets it.
- **Dependencies build automatically.** `dev`/`build` targets declare
  `dependsOn`, so e.g. starting the docs site will first build the component
  library it imports.
- Inside a package you can also run its scripts directly, but going through
  `pnpm nx …` from the repo root is preferred so caching and dependency graphs
  work.

## Anatomy of a component

Every component lives in its own **PascalCase** folder under
`packages/components/src/components/<Name>/` with colocated files:

```
packages/components/src/components/Button/
├── Button.tsx              # implementation
├── Button.module.scss      # styles (CSS Module written in SCSS)
├── index.ts                # barrel export (3 lines, see below)
├── view.ts                 # ⚙️ AUTO-GENERATED — do not edit by hand
└── stories/
    └── Default.stories.tsx # Storybook stories

# richer components add, as needed:
├── <Name>.browser.test.tsx # interaction tests (run in a real browser)
├── locales/                # i18n strings, one file per locale
│   ├── en-US.locale.json
│   └── de-DE.locale.json
├── components/             # nested sub-components (same layout, recursively)
├── hooks/ · lib/           # component-specific hooks / pure helpers
```

Internally, source files import each other through the **`@/` alias**, which
maps to `packages/components/src/`. Consumers (and the docs examples) import
from the published name `@mittwald/flow-react-components`.

## Adding or changing a component

Components are **not** written with `forwardRef` or `FC` directly. They are
wrapped in the **`flowComponent(name, impl)`** factory, use
[`react-aria-components`](https://react-spectrum.adobe.com/react-aria/) for
behavior and accessibility, [`clsx`](https://github.com/lukeed/clsx) for class
composition, and CSS Modules for styling.

Here's the full checklist for a **new component** — using `Badge` as an example.

### 1. Write the component

`src/components/Badge/Badge.tsx`:

```tsx
import type { PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface BadgeProps
  extends PropsWithChildren, FlowComponentProps<HTMLSpanElement> {
  /** The color of the badge. @default "primary" */
  color?: "primary" | "danger";
}

/** @flr-generate all */
export const Badge = flowComponent("Badge", (props) => {
  const { color = "primary", className, children, ref, ...restProps } = props;
  const rootClassName = clsx(styles.badge, styles[color], className);

  return (
    <span className={rootClassName} ref={ref} {...restProps}>
      {children}
    </span>
  );
});

export default Badge;
```

Conventions to follow **exactly**:

- Export an interface named `<Name>Props` that extends the relevant
  `Aria.*Props` (when wrapping a React Aria component) **and**
  `FlowComponentProps<HTMLElement>` (this supplies `ref`, `tunnel`, `wrapWith`,
  …).
- **Document every public prop with a JSDoc comment.** These are extracted into
  the property tables on the docs site — undocumented props ship with empty
  descriptions. Use `@default` for defaults and `@internal` for props that
  aren't part of the public API.
- Wrap the implementation in `flowComponent("<Name>", (props) => …)`. The string
  **must** match the name you register in step 3.
- The **`/** @flr-generate all \*/`\*\* tag tells the remote-components
  generator to emit remote/view artifacts for this component (step 4).
- Export the component **both** as a named export and as the `default`.
- Style children via `PropsContext` / `PropsContextProvider` (from
  `@/lib/propsContext`) rather than threading `className` down manually.

### 2. Write the styles

`src/components/Badge/Badge.module.scss` — a CSS Module in SCSS. **Never
hard-code values**: use design-token CSS custom properties, and shared mixins
from `@/styles/mixins/`:

```scss
@use "@/styles/mixins/focus";

.badge {
  // generic tokens (defined in @mittwald/flow-design-tokens)
  font-size: var(--font-size-text--s);
  padding: var(--size-px--xxs) var(--size-px--xs);
  // component-scoped tokens follow the `--<component>--*` naming convention
  border-radius: var(--badge--corner-radius);

  &:focus-visible {
    @include focus.focus;
  }
}
```

### 3. Add the barrel `index.ts`

Always the same three lines:

```ts
export * from "./view";
export { type BadgeProps, Badge } from "./Badge";
export { default } from "./Badge";
```

### 4. Register the component in the public API

This is the **easy-to-miss** step. Two central registries must be updated, or
the component won't be exported / won't type-check:

1. **`src/components/public.ts`** — add (alphabetically):
   ```ts
   export * from "@/components/Badge";
   ```
2. **`src/components/propTypes/index.ts`** — this is the type registry
   `flowComponent()` is generic over. Import the props type, add it to the
   `FlowComponentPropsTypes` interface, and (if the component supports
   `PropsContext`) add it to `propsContextSupportingComponentsMap`:
   ```ts
   import type { BadgeProps } from "@/components/Badge/Badge";
   // …
   export interface FlowComponentPropsTypes {
     // …
     Badge: BadgeProps;
   }
   ```

### 5. Generate the remote view

`view.ts` is **auto-generated** from the `@flr-generate` tag — never edit it by
hand. Regenerate it (and the auto-generated files in the `remote-*` packages)
with:

```shell
pnpm nx build:remote-components components
```

> ⚠️ **Commit the generated files.** CI runs `git diff --exit-code` and will
> fail if generated code (remote views, icons) isn't committed. See
> [Testing](#testing).

### 6. Add a Storybook story

`src/components/Badge/stories/Default.stories.tsx`. The `title` groups the
component into a category (`Actions`, `Form Controls`, `Status`, `Structure`,
…):

```tsx
import { Badge } from "../index";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Badge> = {
  title: "Status/Badge",
  component: Badge,
};

export default meta;

export const Default: StoryObj<typeof Badge> = {
  args: { children: "New" },
};
```

### 7. Localize (only if the component has user-facing strings)

Add `locales/en-US.locale.json` and `locales/de-DE.locale.json` (ICU
MessageFormat), then consume them with
`useLocalizedStringFormatter(locales, "<Name>")` from
`@/components/TranslationProvider`:

```tsx
import locales from "./locales/*.locale.json";
// …
const t = useLocalizedStringFormatter(locales, "Badge");
// t.format("someKey", { count })
```

### 8. Document it on the docs site

Add a doc set under `apps/docs/src/content/04-components/<category>/<slug>/`
(the content is **not** colocated with the component):

- `index.mdx` — frontmatter `component: Badge` + a `description:`
- `overview.mdx` — usage narrative with `<LiveCodeEditor example="…" />` blocks
- `guidelines.mdx` — design guidelines (when to use / when not)
- `develop.mdx` — usually `# Properties` + `<PropertiesTables />`
  (auto-generated)
- `examples/*.tsx` — live-code snippets, importing from
  `@mittwald/flow-react-components`

Preview with `pnpm nx dev docs`.

> **Special case — remote components:** there are extra rules when a component
> needs to work in a remote environment (e.g. avoid non-remote components in a
> `PropsContext`). See
> [`packages/components/CONTRIBUTE.md`](packages/components/CONTRIBUTE.md).

## Design tokens & icons

Some source files are **generated** and must not be hand-edited:

- **Design tokens** are authored as YAML in
  `packages/design-tokens/src/**/*.yml` (e.g. `src/actions/button.yml` defines
  the `--button--*` custom properties) and built to CSS. Add or change a token
  there, not in the component's SCSS.
- **Icons** are generated from `packages/icons-base` into
  `src/components/Icon/components/icons/` via `pnpm nx build:icons components`.

## Testing

Tests use [Vitest](https://vitest.dev/) and are **colocated** next to the code.
Naming decides how a test runs:

| File pattern         | Project   | Runs in        | Use for                           |
| -------------------- | --------- | -------------- | --------------------------------- |
| `*.browser.test.tsx` | `browser` | a real browser | component interaction / rendering |
| `*.test.ts(x)`       | `unit`    | happy-dom      | pure logic (helpers, hooks)       |

Run them per package via Nx:

```shell
pnpm nx test:compile components      # type-check (tsc --noEmit)
pnpm nx test:unit components         # unit tests
pnpm nx test:browser components      # browser tests (headless)

# watch mode while developing:
pnpm nx test:unit:dev components
pnpm nx test:browser:dev components
```

Browser tests need the Playwright browsers installed once:

```shell
pnpm test:browser:prepare
```

A browser interaction test looks like this:

```tsx
import TextField from "@/components/TextField";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

test("TextField keeps its value on blur", async () => {
  const dom = await render(<TextField aria-label="test" />);
  const input = dom.getByRole("textbox");
  await userEvent.type(input, "hello");
  await userEvent.tab();
  expect(input).toHaveDisplayValue("hello");
});
```

(`globals: true` is set, so `test` / `expect` don't need to be imported.)

### Visual regression testing

Visual regression tests live in **`packages/remote-react-components`**
(`src/tests/visual/`). They render each component in **both** the local and the
remote environment and compare against committed screenshots — catching
unintended visual changes, such as a design-token tweak that ripples further
than expected.

```shell
pnpm test:browser:prepare   # install the test browsers (once)

# run the visual tests (headless, WebKit):
pnpm nx run remote-react-components:test:visual --browser.name=webkit

# open a real browser to inspect interactively:
pnpm nx run remote-react-components:test:visual:dev --browser.name=webkit
```

When you add or change a component, update its screenshots and review the diffs:

```shell
pnpm nx run remote-react-components:test:visual:update          # all
pnpm nx run remote-react-components:test:visual:update <Name>   # filtered
```

Then add the **`update-screenshots`** label to your PR — a GitHub Action
regenerates the reference screenshots on Linux (matching CI) and commits them
back to your branch. Never commit local `*--Local--*.png` / `*--Remote--*.png`
diff artifacts.

See
[`packages/remote-react-components/CONTRIBUTE.md`](packages/remote-react-components/CONTRIBUTE.md)
for the full guide — what and how to test, remote-vs-local differences, and CI
details.

To run everything the way CI does:

```shell
pnpm lint            # ESLint + Stylelint
pnpm affected:test   # unit + compile for changed projects
pnpm test            # unit + compile for all projects
```

> ⚠️ **Generated code must be committed.** The final CI step is
> `git diff --exit-code`. If you changed a component with `@flr-generate` or
> touched icons, run the relevant `build:*` target and commit the result —
> otherwise CI fails even though your code is correct.

## Code style

Formatting and linting are enforced; the pre-commit hook runs `pnpm lint` for
you.

```shell
pnpm lint      # check with ESLint + Stylelint
pnpm format    # auto-format everything with Prettier
```

Enforced conventions (see `eslint.config.js` / `.prettierrc.json`):

- Double quotes, semicolons required, Unix (`\n`) line endings.
- `import type { … }` for type-only imports (separated from value imports).
- Unused variables are errors — prefix intentionally-unused ones with `ignored`
  (e.g. `argIgnored`).

## Commit conventions

Flow uses [Conventional Commits](https://www.conventionalcommits.org/). This is
**not optional cosmetics** — Lerna-Lite derives version bumps and the changelog
from your commit messages.

```
<type>(<scope>): <short summary>
```

- **type**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, …
- **scope**: the component or area you touched — e.g. the component name
  (`Button`, `TextField`), or an area (`components`, `docs`, `ci`, `Remote`).

Real examples from the history:

```
feat(components): add deprecation warning provider
fix(PasswordCreationField): adjust validation behavior
fix(CodeEditor): fix height and colors
chore(docs): migrate site URL and redirect pages
```

`feat` and `fix` are user-facing and drive releases; use `chore`/`docs`/`ci` for
everything that isn't.

## Opening a pull request

1. Branch off `main`: `git checkout -b fix/button-focus-ring`.
2. Make your change, following the conventions above.
3. Before pushing, make sure the checklist passes:
   - [ ] `pnpm lint` is clean
   - [ ] `pnpm affected:test` passes (unit + type-check)
   - [ ] browser tests pass if you touched behavior
   - [ ] **generated code is committed** (`git diff` is empty after running the
         relevant `build:*` targets)
   - [ ] docs updated if you changed a public API
4. Push to your fork and open a PR against `mittwald/flow`'s `main` branch.

CI (`.github/workflows/test.yml`) runs lint, unit tests, and browser tests
(WebKit) on every PR, and verifies all generated code is committed. A preview
deployment is built for each PR so reviewers can see your changes live.

PRs are **squash-merged**, so the PR title becomes the commit on `main` — give
it a Conventional-Commits-style title.

## Releases

You don't need to do anything to release. When a PR is merged into `main`,
Lerna-Lite (via `.github/workflows/publish.yml`) versions the affected packages
based on the Conventional Commits and publishes them to npm. Third-party
dependencies are held back for a week (`minimumReleaseAge`) before being
adopted.

## Getting help

- 🐛 **Found a bug?** Open an issue using the
  [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml).
- 🎨 **Feedback on the design / style guide?** Use the
  [style guide feedback template](.github/ISSUE_TEMPLATE/general-style_guide_feedback.yml).
- 📖 **Docs:** [flow.mittwald.de](https://flow.mittwald.de/)
- 🧩 **Storybook:**
  [storybook.flow-components.de](https://storybook.flow-components.de)

Happy contributing! 💙
