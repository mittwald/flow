# Contributing to Flow

First off — thank you for taking the time to contribute! 🎉

**Flow** is [mittwald's design system](https://flow.mittwald.de/). This
repository is a monorepo containing the React component library, design
tokens, icon sets, the remote-rendering stack, and the documentation site.

This guide is for people who want to **work on Flow itself**. If you only
want to _use_ Flow in your own project, you're in the wrong place — head to
[flow.mittwald.de](https://flow.mittwald.de/) instead. For deep dives beyond
this guide, every package ships an `AGENTS.md` next to its code — written
for AI coding agents, but great reference docs for humans too.

## Table of contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Repository overview](#repository-overview)
- [The ground rules](#the-ground-rules)
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

We use [pnpm](https://pnpm.io/) as the package manager. The easiest way to
get the exact pinned version is
[Corepack](https://nodejs.org/api/corepack.html), which ships with Node.js:

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

Storybook opens on <http://localhost:6006>. This is where you'll spend most
of your time when developing components.

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

| Package                        | npm name                              | What it is                                                 |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `packages/components` ⭐       | `@mittwald/flow-react-components`     | **The core React component library.** Start here.          |
| `packages/design-tokens`       | `@mittwald/flow-design-tokens`        | Design tokens (colors, spacing, typography) as YAML → CSS  |
| `packages/icons` / `icons-pro` | `@mittwald/flow-icons` / `-icons-pro` | The default and pro icon sets (generated from `icons-base`) |
| `packages/stylesheet`          | `@mittwald/flow-stylesheet`           | The components' `all.css`, published as a standalone CSS package |
| `apps/docs`                    | `@mittwald/flow-documentation`        | The public documentation site (Next.js)                    |

Supporting packages (touch these only when your change concerns them):

| Package                                | Purpose                                                          |
| -------------------------------------- | ---------------------------------------------------------------- |
| `packages/remote-*`                    | The remote-rendering stack (render Flow UI from sandboxed mStudio extensions) |
| `packages/react-tunnel`                | Render React components through a "tunnel" (portal-like)         |
| `packages/ext-bridge`, `mstudio-ext-*` | Building blocks for mStudio embedded extensions                  |
| `packages/codemods`                    | Codemods to help consumers migrate between versions              |
| `packages/typescript-config`           | Shared TypeScript config                                         |
| `apps/remote-dom-demo`                 | Demo app for the remote-rendering stack                          |

## The ground rules

Five invariants that hold everywhere in this repo — internalize these and
the rest is detail:

1. **Generated code is committed — and never hand-edited.** Remote views,
   icon components, and `doc-properties.json` are generated. After changing
   their sources, regenerate (`pnpm build` covers everything) and commit the
   result. CI fails on any uncommitted generated diff.
2. **Don't break extension developers.** Props of `@flr-generate` components
   are a contract — mStudio extensions in the wild use them. Keep old paths
   working and log their usage with `useWarnDeprecation`. Breaking changes
   for consumers ship with a `MIGRATION.md` entry and ideally a codemod in
   `packages/codemods`.
3. **Design comes from UX.** Base design tokens are taboo. Component tokens
   for a new component are fine — model them on existing components and ask
   when unsure. Never invent visual design.
4. **UI text is bilingual.** Everything user-facing ships in
   `locales/de-DE.locale.json` **and** `locales/en-US.locale.json`. A new
   language is welcome — but then translate everything initially.
5. **Dependencies are deliberate.** New package versions younger than one
   week won't resolve (`minimumReleaseAge`; `@mittwald/*` exempt), and the
   pnpm patches in `patches/` are intentional — leave them alone.

## Development workflow

Nx runs the scripts of each package as **targets**. The general shape is
`pnpm nx <target> <project>`:

```shell
pnpm nx dev components      # Storybook for the component library (port 6006)
pnpm nx dev docs            # the documentation site (Next.js)
pnpm nx dev remote-dom-demo # the remote-rendering demo app
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
  `pnpm nx …` from the repo root is preferred so caching and dependency
  graphs work.
- **Adding a script?** Wire up its Nx metadata (`dependsOn`,
  `inputs`/`outputs` in `project.json` or `nx.json`) — otherwise caching
  serves stale results and `nx affected` misses your target.

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
behavior and accessibility, [`clsx`](https://github.com/lukeed/clsx) for
class composition, and CSS Modules for styling.

Before you code: pick a similar existing component as your template —
`TextField` (form control), `Modal` (overlay), `Alert` (simple semantic
component), `Button` (action). Copying its structure is the fastest way to
get every convention right.

Here's the full checklist for a **new component** — using `Badge` as an
example.

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
  `FlowComponentProps<HTMLElement>` (this supplies `ref`, `tunnel`,
  `wrapWith`, …). The **ref is a normal prop** (React 19) — no `forwardRef`.
- **Document every public prop with a JSDoc comment.** These are extracted
  into the property tables on the docs site — undocumented props ship with
  empty descriptions. Use `@default` for defaults and `@internal` for props
  that aren't part of the public API.
- Wrap the implementation in `flowComponent("<Name>", (props) => …)`. The
  string **must** match the name you register in step 4.
- The `/** @flr-generate all */` tag marks the component as
  **remote-capable**: the generator emits remote/view artifacts for it
  (step 6), and its props become part of the extension contract. Only add it
  when the component should be available to mStudio extensions.
- Export the component **both** as a named export and as the `default`.

### 2. Write the styles

`src/components/Badge/Badge.module.scss` — a CSS Module in SCSS. Scoped
class names are generated from the component path (semantic CSS by design),
so don't bypass CSS Modules for component roots. **Never hard-code values**:
use design-token CSS custom properties, and shared mixins from
`@/styles/mixins/` (`focus`, `formControl`, `ellipsis`):

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

The root class is the lower-camel component name; modifier classes match
prop values (`.primary`, `.size-s`). Need new `--badge--*` tokens? See
[Design tokens & icons](#design-tokens--icons).

### 3. Add the barrel `index.ts`

Always the same three lines (the `./view` line only exists on
`@flr-generate` components — the file is generated in step 6):

```ts
export * from "./view";
export { type BadgeProps, Badge } from "./Badge";
export { default } from "./Badge";
```

### 4. Register the component in the public API

This is the **easy-to-miss** step. Two central registries must be updated,
or the component won't be exported / won't type-check:

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

Remote-capable components are additionally exported from
**`src/index/flr-universal.ts`** — being in `public.ts` does **not**
automatically include a component there.

### 5. Style children via PropsContext

When your component composes other Flow components, don't thread `className`
or defaults down manually — provide a `PropsContext` so children adapt
automatically (this is the backbone of Flow's composability; e.g. an
`<Icon>` inside `<IllustratedMessage>` automatically renders with
`size="l"`):

```tsx
import { PropsContextProvider, type PropsContext } from "@/lib/propsContext";

const propsContext: PropsContext = {
  Icon: { className: styles.icon, size: "l" },
};

<PropsContextProvider props={propsContext}>{children}</PropsContextProvider>;
```

- `dynamic()` derives context values from the consumer's local props.
- **Only remote-capable components belong in a context** — non-remote
  components break remote rendering.
- Inside `flr-universal` components, compose internals through **views**
  (`@/views/*` — e.g. `ButtonView` instead of `Button`): views switch to the
  remote counterpart automatically.

### 6. Generate the remote artifacts

`view.ts` is **auto-generated** from the `@flr-generate` tag — never edit it
by hand. Regenerate it (and the auto-generated files in the `remote-*`
packages) with:

```shell
pnpm nx build:remote-components components
```

> ⚠️ **Commit the generated files.** CI runs `git diff --exit-code` and will
> fail if generated code (remote views, icons) isn't committed. See
> [Testing](#testing).

For remote-capable components, also:

- Exclude props that must not cross the remote boundary with
  `@flr-ignore-props` (`style` & friends are ignored globally — see
  `dev/remote-components-generator/config.ts`).
- Add a demo page in `apps/remote-dom-demo/src/app/remote/<component>/`.
- Remember: from now on these props are a **contract with extension
  developers** — never break them; deprecate with `useWarnDeprecation`.

### 7. Add a Storybook story

`src/components/Badge/stories/Default.stories.tsx`. The `title` groups the
component into a category (`Actions`, `Form Controls`, `Status`,
`Overlays`, …) — match the category used on the docs site. Use realistic
args and add a named story per meaningful variant or state:

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

### 8. Localize (only if the component has user-facing strings)

Add `locales/de-DE.locale.json` **and** `locales/en-US.locale.json`
([ICU MessageFormat](https://formatjs.github.io/docs/core-concepts/icu-syntax/)
is supported), then consume them with
`useLocalizedStringFormatter(locales, "<Name>")` from
`@/components/TranslationProvider`:

```tsx
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
// …
const stringFormatter = useLocalizedStringFormatter(locales, "Badge");
stringFormatter.format("dismiss");
stringFormatter.format("itemCount", { count: 3 });
```

```json
// locales/de-DE.locale.json — plain strings, variables, plural/select:
{
  "dismiss": "Schließen",
  "itemCount": "{count, plural, one {Ein Element} other {{count} Elemente}}"
}
```

(For real-world plural/select usage, see
`src/components/PasswordCreationField/locales/`.)

Accessibility goes hand in hand with this: icon-only buttons need a
localized `aria-label`, decorative icons are `aria-hidden` (the `Icon`
component handles that automatically when no label is given).

### 9. Document it on the docs site

Add a doc set under `apps/docs/src/content/04-components/<category>/<slug>/`
(the content is **not** colocated with the component — copy the structure of
a neighbor like `actions/button/`):

- `index.mdx` — frontmatter `component: Badge` + a `description:`
- `overview.mdx` — usage narrative with `<LiveCodeEditor example="…" />`
  blocks
- `guidelines.mdx` — design guidelines (when to use / when not)
- `develop.mdx` — usually `# Properties` + `<PropertiesTables />`
  (generated from your prop JSDoc; regenerate with
  `pnpm nx build:docs-properties components`)
- `examples/*.tsx` — live-code snippets, importing from
  `@mittwald/flow-react-components`

The docs prose is written in **German**. Preview with `pnpm nx dev docs`.

## Design tokens & icons

Some source files are **generated** and must not be hand-edited:

- **Design tokens** are authored as YAML in
  `packages/design-tokens/src/**/*.yml` and built to CSS with
  style-dictionary. Component tokens live in category files —
  `src/actions/button.yml` defines the `--button--*` custom properties.
  Adding a file like this for a new component is fine (model it on an
  existing one). **Base tokens** (top-level files: colors, font, size, …)
  are design authority — never change them on your own; ask when unsure.
- **Icons** have a single source of truth: `packages/icons-base/src/icons.yaml`.
  The icon sets and the component-internal icons are generated from it:
  `pnpm nx build:icons icons`, `… icons-pro`, `… components` — or simply
  `pnpm build`.

## Testing

Tests use [Vitest](https://vitest.dev/) and are **colocated** next to the
code. Naming decides how a test runs:

| File pattern         | Project   | Runs in        | Use for                            |
| -------------------- | --------- | -------------- | ---------------------------------- |
| `*.browser.test.tsx` | `browser` | a real browser | component interaction / rendering  |
| `*.test.ts(x)`       | `unit`    | happy-dom      | pure logic (helpers, hooks)        |
| `*.test-types.tsx`   | —         | type-check     | generic/typed public APIs          |

The bar: **every component has stories** (they double as the review and
visual-test surface); browser tests when there is real behavior
(interaction, controlled state, async flows, forms); unit tests for lib
functions; type tests for generic APIs.

Run them per package via Nx:

```shell
pnpm nx test:compile components      # type-check (tsc --noEmit)
pnpm nx test:unit components         # unit tests
pnpm nx test:browser components --browser.name=webkit   # browser tests (headless)

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

(`globals: true` is set, so `test` / `expect` don't need to be imported.
Query by role — that keeps the DOM accessible, too.)

### Visual regression testing

Visual regression tests live in **`packages/remote-react-components`**
(`src/tests/visual/`). They render each component in **both** the local and
the remote environment and compare against committed screenshots — catching
unintended visual changes, such as a design-token tweak that ripples further
than expected. Screenshots are keyed by browser and OS
(e.g. `Badge-webkit-linux.png`).

```shell
# run the visual tests (headless, WebKit):
pnpm nx test:visual remote-react-components --browser.name=webkit

# open a real browser to inspect interactively:
pnpm nx test:visual:dev remote-react-components --browser.name=webkit
```

When you add or change a component, update its screenshots and review the
diffs:

```shell
pnpm nx test:visual:update remote-react-components          # all (slow!)
pnpm nx test:visual:update remote-react-components <Name>   # single component
```

Local runs update the baselines for **your** OS. Additionally add the
**`update-screenshots`** label to your PR — a GitHub Action regenerates the
reference screenshots on Linux (matching CI) and commits them back to your
branch.

> ⚠️ When a visual test fails, it writes `*--Local--*.png` /
> `*--Remote--*.png` diff artifacts showing the difference between the two
> environments. Use them to inspect the failure — but **never commit them**;
> only the baselines belong in the repo.

To run everything the way CI does:

```shell
pnpm lint                                                       # ESLint + Stylelint
pnpm affected:test                                              # unit + compile, changed projects
pnpm affected:test:browser --parallel=1 --browser.name=webkit   # browser/e2e/visual
```

> ⚠️ **Generated code must be committed.** The final CI step is
> `git diff --exit-code`. If you changed a component with `@flr-generate` or
> touched icons, run the relevant `build:*` target and commit the result —
> otherwise CI fails even though your code is correct.

## Code style

Formatting and linting are enforced; the pre-commit hook runs `pnpm lint`
for you.

```shell
pnpm lint      # check with ESLint + Stylelint
pnpm format    # auto-format everything with Prettier
```

Enforced conventions (see `eslint.config.js` / `.prettierrc.json`):

- Double quotes, semicolons required, Unix (`\n`) line endings.
- `import type { … }` for type-only imports (separated from value imports).
- Unused variables are errors — intentionally-unused ones need `ignored` in
  their name (e.g. `argIgnored`).

## Commit conventions

Flow uses [Conventional Commits](https://www.conventionalcommits.org/). This
is **not optional cosmetics** — Lerna-Lite derives version bumps and the
changelog from your commit messages.

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

`feat` and `fix` are user-facing and drive releases; use `chore`/`docs`/`ci`
for everything that isn't. Write messages for the changelog reader.

## Opening a pull request

1. Branch off `main`: `git checkout -b fix/button-focus-ring`.
2. Make your change, following the conventions above.
3. Before pushing, make sure the checklist passes:
   - [ ] `pnpm lint` is clean
   - [ ] `pnpm affected:test` passes (unit + type-check)
   - [ ] browser tests pass if you touched behavior
   - [ ] **generated code is committed** (`git diff` is empty after running
         the relevant `build:*` targets)
   - [ ] intentional visual changes: snapshots updated
         (`test:visual:update` locally and/or the `update-screenshots` label)
   - [ ] docs updated if you changed a public API
4. Push to your fork and open a PR against `mittwald/flow`'s `main` branch.

CI (`.github/workflows/test.yml`) runs lint, unit tests, and browser tests
(WebKit) on every PR, and verifies all generated code is committed. A
preview deployment of docs + Storybook is built for each PR so reviewers can
see your changes live.

PRs are **squash-merged**, so the PR title becomes the commit on `main` —
give it a Conventional-Commits-style title.

## Releases

You don't need to do anything to release. When a PR is merged into `main`,
Lerna-Lite (via `.github/workflows/publish.yml`) versions the packages based
on the Conventional Commits, generates the changelogs, and publishes to npm.

## Getting help

- 🐛 **Found a bug?** Open an issue using the
  [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml).
- 🎨 **Feedback on the design / style guide?** Use the
  [style guide feedback template](.github/ISSUE_TEMPLATE/general-style_guide_feedback.yml).
- 📖 **Docs:** [flow.mittwald.de](https://flow.mittwald.de/)
- 🧩 **Storybook:**
  [storybook.flow-components.de](https://storybook.flow-components.de)

Happy contributing! 💙
