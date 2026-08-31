# Using Flow — guide for agents and developers

How to build an application **with** `@mittwald/flow-react-components`. If you
are changing Flow itself, read [AGENTS.md](./AGENTS.md) instead — the two
audiences need opposite advice, and applying the contributor patterns in an
application is the most common mistake made here.

## The documentation is machine-readable

The prose that decides most questions — which component covers a use case, how
spacing is composed, which pattern applies — lives on the docs site and is
published for machine consumption:

| URL                                      | What it is                                                     |
| ---------------------------------------- | -------------------------------------------------------------- |
| `https://flow.mittwald.de/llms.txt`      | Index of every page, grouped by section                        |
| `https://flow.mittwald.de/llms.json`     | Manifest: title, description, page URL, Markdown URL per page  |
| `https://flow.mittwald.de/raw/<path>.md` | One page as Markdown, e.g. `/raw/components/actions/button.md` |
| `https://flow.mittwald.de/llms-full.txt` | Every page in one file (~1.7 MB)                               |

**Fetch a page before answering a design question.** The pages are **written in
German**; component names and design-system terms (Variants, Colors, Sizes,
States, Props) are not translated.

Start with these:

- `/raw/foundations/structure/layout.md` and `spacing.md` — how layout and
  spacing are meant to be composed
- `/raw/patterns/patterns/forms.md`, `detail-page.md`, `errorhandling.md`,
  `list-tile-table.md` — the recurring flows
- `/raw/foundations/content-guidelines/sprach-guide.md` — UI wording
- `/raw/get-started/versioning.md` — what you may depend on

## Setup

```shell
pnpm add @mittwald/flow-react-components
```

Import the stylesheet once, at your application's entry point:

```ts
import "@mittwald/flow-react-components/all.css";
```

Use `all-layered.css` instead when your application has its own CSS that must be
able to override Flow's without specificity fights — it wraps the same rules in
`@layer`.

Application-wide component behaviour goes into `ComponentDefaultsProvider`
rather than being repeated at every usage:

```tsx
<ComponentDefaultsProvider
  defaults={{ Form: { confirmModalCloseOnUnsavedChanges: false } }}
>
  <App />
</ComponentDefaultsProvider>
```

Other providers you may need: `TranslationProvider` (UI language and string
overrides), `RouterProvider` (so `Link` and navigation use your router),
`NotificationProvider` (required before `useNotificationController`).

## Import addresses

| Specifier                                                    | Use it for                                      |
| ------------------------------------------------------------ | ----------------------------------------------- |
| `@mittwald/flow-react-components`                            | All components. This is where you import from.  |
| `@mittwald/flow-react-components/nextjs`                     | Next.js integration                             |
| `@mittwald/flow-react-components/react-hook-form`            | react-hook-form integration                     |
| `@mittwald/flow-react-components/mittwald-password-tools-js` | password-strength integration                   |
| `@mittwald/flow-react-components/all.css`                    | Stylesheet                                      |
| `@mittwald/flow-react-components/component-index`            | Machine-readable component + prop index (below) |

**Do not import from `/internal`.** It exposes Flow's own infrastructure
(`flowComponent`, prop helper types, the status registry) and is not a consumer
API.

## Finding the right component

`@mittwald/flow-react-components/component-index` is a JSON index of every
public component — import specifier, lifecycle status, description, and the
props that are actually Flow's API (the inherited HTML/SVG attributes are
filtered out):

```jsonc
{
  "components": {
    "Button": {
      "importFrom": ["@mittwald/flow-react-components"],
      "level": "stable",
      "props": {
        "variant": {
          "type": "\"solid\" | \"soft\" | \"outline\" | \"plain\"",
          "default": "\"solid\"",
          "description": "…",
        },
      },
    },
  },
}
```

Read `level` before you commit to a component:

- `stable` — bound by the version contract.
- `beta` — its API may change in a non-major release.
- `deprecated` — carries a `deprecationNotice` with the migration path. Do not
  introduce new usages.

`llms.json` resolves a component name to its documentation page.

## Layout and spacing

**Compose layout from components and their props. Do not write layout CSS
against Flow components.**

- `LayoutCard` — the page-content container; brings its own padding.
- `Section` — vertical structure inside a card. Spacing between sections is
  automatic, driven by sibling selectors, so `Section`s must be actual siblings.
- `ColumnLayout` — the column grid, with `gap` / `rowGap` / `columnGap`
  (`s | m | l | xl`).
- `Flex` — the general-purpose flex container. It is the one component with a
  full spacing prop API: `gap`, `rowGap`, `columnGap`, `padding`,
  `paddingTop|Bottom|Left|Right`, each on the `xs | s | m | l | xl` scale.
- `Combine` — arranges known component combinations (avatar + name + subtitle,
  and similar) correctly relative to each other.
- `Separator` — an explicit divider.

```tsx
// ✅ spacing through the scale
<Flex direction="column" gap="m" padding="s">
  <Heading>Projekte</Heading>
  <Text>…</Text>
</Flex>

// ⛔ hard-coded values, and a Flow component styled from outside
<div style={{ display: "flex", gap: 16, padding: 8 }}>…</div>
<Button className="my-app-button" style={{ marginTop: 24 }}>…</Button>
```

The scale is not decoration: `m` is 16px, `s` is 8px, `xs` is 4px. Reaching for
20px means the design does not fit the system yet — that is a question for UX,
not a value to hard-code.

## What you must not depend on

The version contract deliberately leaves several surfaces unguaranteed. They can
change in **any** release (see
`https://flow.mittwald.de/raw/get-started/versioning.md`):

- **CSS class names** (`.flow--button`, …) — never write selectors against them.
- **Design-token names and values** (`--size-px--m`, `--color--gray--500`) —
  they are Flow's internal vocabulary, not a consumer API. Use the component
  props above instead.
- **Internal DOM structure** — do not rely on the element tree a component
  renders.
- **TypeScript types** — best-effort. Pin an exact version if a `tsc` break on a
  patch release would hurt.

Where you genuinely need an escape hatch, `className` on a Flow component is the
supported one, and `Div` exists for a plain styled container. Both are a signal
to check whether a Flow component already covers the case.

## Mistakes to avoid

These come from Flow's **internals** and have no place in an application:

- `flowComponent(...)` — the factory that registers Flow's own components.
- `PropsContext` / `PropsContextProvider` — how Flow components configure their
  descendants internally. Exported, but not a consumer feature.
- Views (`@/views/*`), `view.ts`, `flr-*` elements — the remote-rendering layer
  for mStudio extensions.
- CSS modules mirroring Flow's own `.module.scss` structure.

Also:

- Do not re-implement a component that exists. Check the component index first.
- Do not build your own form validation wiring — use `Form` and the
  `react-hook-form` integration.
- Do not hand-roll feedback for async work — `Action` wraps a button and renders
  its pending, success and failure states; `List` covers loading and empty
  states; `Skeleton` and `SkeletonText` are the placeholders.
- Write UI text in German following the Sprach-Guide; component-internal text is
  already translated (de-DE, en-US) via `TranslationProvider`.

## Links

- Documentation — <https://flow.mittwald.de>
- Storybook — <https://storybook.flow-components.de>
- Source and issues — <https://github.com/mittwald/flow>
- Upgrade notes — [MIGRATION.md](./MIGRATION.md), applied by
  `npx @mittwald/flow-codemods@latest upgrade`
