# flow Styleguide Content Guidelines

This document describes the structure, purpose, and writing conventions of the
**flow Styleguide**. It serves as a reference for everyone — humans and AI
agents alike — creating or maintaining documentation within the design system
and helps ensure consistency across all content.

The flow Styleguide is the public documentation of the flow Design System. It
not only documents Components but also communicates design principles and best
practices for building user-centered interfaces with flow.

## Styleguide

The Styleguide is available at:

https://flow.mittwald.de/

All content lives in `src/content`, organized in one directory per section
(`01-get-started`, `02-foundations`, `03-patterns`, `04-components`). Pages are
written in MDX.

## Styleguide Structure

The Styleguide consists of several main sections, each serving a different
purpose.

### Home

The home page provides general information about the flow Design System and
highlights important links. It acts as an entry point rather than explanatory
documentation and may be updated whenever new or important topics should be
highlighted.

### Get Started

The **Get Started** section introduces users to the Styleguide and the flow
Design System.

It contains the essential information required to begin working with flow.
Unlike **Foundations**, this section focuses on practical basics rather than
conceptual topics.

A useful question when deciding whether content belongs here is:

> _Is this something users need to know in order to understand and start using
> flow?_

If the answer is yes, the topic belongs in **Get Started**.

Since this content is generally read only once, other Styleguide pages should
rarely link back to it.

### Foundations

The **Foundations** section explains the conceptual building blocks of the
design system.

It covers design principles and system concepts that help users understand how
flow works, even though they are not always required for implementing individual
Components.

Typical topics include:

- Design tokens and Themes
- Typography and Color
- Layout and Spacing principles
- Content guidelines (for example the Sprach-Guide or wording rules for error
  messages)
- Accessibility

The internal structure of this section may evolve over time. Note that complex
user flows — such as how error handling behaves across a page — are documented
in **Patterns**, not here.

### Patterns

**Patterns** document common user flows and interactions involving multiple
Components. Examples are Forms, Errorhandling, or the structure of a detail
page.

They demonstrate recurring solutions through concise code examples that can
easily be reused. Code examples should remain compact to avoid excessive
scrolling.

Smaller implementation examples belong in **Code Snippets**, a subsection of
Patterns.

### Components

Each Component has its own documentation page describing its purpose, API, and
usage.

Every Component directory contains an `index.mdx` whose frontmatter defines the
Component name and its introduction:

```mdx
---
component: Section
description:
  Eine Section erhöht die Übersichtlichkeit, indem sie den Content in vertikale
  Teilbereiche mit festen Abständen gliedert.
---

<LiveCodeEditor editorDisabled />
```

The `description` is rendered at the top of the page and should explain what the
Component is used for as concisely as possible — typically one to three
sentences.

Each Component page normally contains three tabs, backed by one MDX file each:

- Overview (`overview.mdx`)
- Develop (`develop.mdx`)
- Guidelines (`guidelines.mdx`)

A tab may be omitted when it would not provide value yet (for example, purely
technical integrations such as the React Hook Form Components have no Guidelines
tab).

---

## Component Tabs

### Overview

The **Overview** tab provides a quick technical introduction to a Component.

Its primary goal is to help developers understand how to use the Component with
minimal reading.

The recommended structure (each item is a `#` section):

1. `# Playground`

- A representative example that can easily be copied.
- Notes about implementation details or important considerations, with code
  identifiers as inline code (for example `<Button />`, `onPress`).

2. `# Variants`

- Available variants of the Component, if it has variants.

3. Additional properties, each as its own section

- For example `# Color`, `# Sizes`, or similar options.
- Options are typically explained as a bold term followed by a description, for
  example: `**Solid:** Die Solid-Variant zeichnet sich durch ...`

4. `# States` (or a specific state such as `# Disabled`)

- Demonstrates the supported Component states.

5. `# Kombiniere mit ...`

- Explains how the Component integrates with other Components. This is always
  the last section.

### Develop

The **Develop** tab focuses on the technical implementation of the Component.

It always starts with a `# Properties` section containing the
`<PropertiesTables />` Component, which renders the props documentation
generated from the prop JSDoc.

Additional sections may follow for:

- Technical implementation details
- Solutions for advanced use cases
- Implementation-specific guidance

### Guidelines

The **Guidelines** tab explains **when** and **why** a Component should be used.

While the Overview describes _how_ to implement a Component, the Guidelines
focus on proper usage.

The structure below is the convention. `# Grundlagen` with its two standard
subsections is required; all other sections are added when they provide value
for the Component:

1. `# Grundlagen` — a short introduction (plain text directly below the
   heading), followed by:

- `## Best practices` — a bullet list opening with the phrase _„Achte bei der
  Verwendung einer/eines X darauf, dass ..."_
- `## Verwendung` — a bullet list opening with the phrase _„Verwende eine/n X,
  um ..."_
- `## X vs. Y` — a comparison with similar Components (for example
  `## Button vs. Link`), if the Component is easily confused with another one.

2. `# Anwendung` — how the Component is applied in context, for example
   `## Position` and `## Hierarchie`.

3. `# Inhalt` — which elements and sub-Components belong inside the Component
   (for example, which content a Modal should contain).

4. `# Writing Guidelines` — how the content displayed inside the Component is
   worded. Depending on the Component, this may include Labels, Text, Icons, or
   Illustrations.

5. `# Verhalten` — how the Component behaves in different situations, such as
   `## Responsive layout` or interaction behavior.

6. `# Accessibility` — accessibility considerations specific to the Component.

---

# Writing Guidelines

## Language

The Styleguide content is written in **German**.

- Component names and Design System terminology are never translated: write
  **Button**, **Section**, **Dialog** as well as Variants, Colors, Sizes,
  States, and Props. The generic word itself, however, is written in German:
  „Komponente“ / „Komponenten“.
- Headings are written in German (`# Grundlagen`, `# Anwendung`, `# Verhalten`).
  Established technical terms remain English — for example `Best practices`,
  `Writing Guidelines`, `Accessibility`, `Playground`, `Properties`, and
  property names such as `Disabled`.
- Headings use sentence case: only the first word and names/terms are
  capitalized (`## Best practices`, `## Responsive layout`).

## Tone of Voice

The Styleguide is technical documentation. Two writing modes are used, depending
on what a passage does:

**Descriptions** explain what a Component is or how it behaves. Write them in a
clear and objective style, focused on the Component — do not address the reader.

Good:

> Die Section sorgt automatisch für Abstände zwischen den darin platzierten
> Elementen.

Avoid:

> Du bekommst automatisch Abstände zwischen den Elementen.

**Instructions** tell the reader how to use a Component correctly (Best
practices, Verwendung, Do/Dont captions). Write them as direct imperatives in
the informal du-form:

> Verwende eine Section, um Content in kleinere Teilbereiche zu gliedern.

> Achte bei der Verwendung eines Buttons darauf, dass er leicht zu finden ist.

Avoid indirect or passive phrasings ("man sollte", "es wird empfohlen") where an
imperative is clearer.

## Component Names

Never translate Component names or Design System terminology.

Use:

- **Button**
- **Section**
- **Dialog**

instead of translated equivalents.

When a Component name appears in prose, link it to the Component's Overview page
(see [Links](#links)). Write the name in plain text when it is mentioned
repeatedly or when no page exists for it (for example sub-elements such as
SectionAction).

## Code, Bold and Links

### Inline Code

Use inline code for everything that appears exactly as written in the
implementation, including:

- HTML elements and attributes (`aria-label`)
- Props (`onPress`)
- Component names in code (`<Button />`)
- CSS classes
- Tokens

Inline code is only used for code-related identifiers — never for emphasis, and
code identifiers are never written in bold.

### Bold

Use bold sparingly to emphasize important terms, and for option names followed
by their explanation in Overview sections (for example
`**Solid:** Die Solid-Variant ...`).

Do not use bold for Component names in prose — link them instead — and never for
code identifiers.

### Links

Use inline links generously to connect related documentation.

- Component names in prose link to the Component's Overview page:
  `[Section](/04-components/structure/section/overview)`.
- Links are root-relative (starting with `/01-get-started`, `/02-foundations`,
  `/03-patterns`, or `/04-components`).
- Avoid linking to the same page multiple times within a short section unless it
  improves readability.

## Headings and Page Structure

The visible page title (H1) is generated automatically — for Components from the
frontmatter of `index.mdx`, for other pages from their `title`. Never write your
own page title as a heading.

Markdown headings are therefore shifted down one level when rendered:

| Markdown | Rendered as | Anchor link             |
| -------- | ----------- | ----------------------- |
| `#`      | `<h2>`      | yes (anchor navigation) |
| `##`     | `<h3>`      | yes (anchor navigation) |
| `###`    | `<h4>`      | no                      |
| `####`   | `<h5>`      | no                      |

- Use `#` for the top-level sections of a page — for example `# Grundlagen`,
  `# Anwendung`, `# Verhalten`. A page usually has several `#` sections.
- Separate `#` sections from each other with a horizontal rule (`---`).
- `#` and `##` headings appear in the anchor navigation ("Auf dieser Seite").
  Keep them concise so the navigation remains readable.

---

# Page Building Blocks

The most important MDX Components for writing content:

- `<LiveCodeEditor />` — renders an interactive code example. Without an
  `example` prop it uses `examples/default.tsx`; with `example="name"` it
  renders `examples/name.tsx` from the `examples` directory next to the MDX
  file. Common props: `editorCollapsed` (code initially hidden),
  `editorDisabled` (no editor), `row`, `bgColor`, `zoom`, `stretch`.
- `<Do example="...">` / `<Dont example="...">` — a good or bad usage example
  with an explanatory caption. Captions are written as imperatives („Verwende
  ...", „Ignoriere nicht ...").
- `<DoAndDont>` — groups several `<Do>`, `<Dont>`, `<Info>`, or `<Plain>` tiles
  next to each other.
- `<Info heading="..." example="...">` — a neutral annotated example, for
  example for responsive behavior (`mobile` prop).
- `<Plain heading="...">` — a plain text/list tile, for example in `## X vs. Y`
  comparisons.
- `<Alert>` with `<Heading>` and `<Content>` — highlighted notes.

Frontmatter:

- Component `index.mdx`: `component` (the Component name) and `description` (the
  introduction, one to three sentences).
- All other pages: `title` and optionally `description`.

---

# Quality Assurance

Before publishing documentation:

- Review grammar and spelling.
- Ensure terminology, tone, and headings follow this guide.
- Verify that links are correct and point to existing pages.
- Keep content concise and consistent.
- Run `pnpm format` (Prettier) — prose is wrapped at 80 characters.
- AI-based proofreading tools may be used to support the review process.
