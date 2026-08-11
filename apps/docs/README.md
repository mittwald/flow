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

Each Component has its own documentation page. A page is a **single**
`index.mdx` file — one continuous page, read top to bottom. (Earlier the content
was split across three tabs, `overview.mdx`, `develop.mdx`, and
`guidelines.mdx`; these are consolidated into `index.mdx`.)

The frontmatter defines the Component name and its introduction:

```mdx
---
component: Modal
description: Ein Modal zeigt Inhalte zentriert als Overlay über der Hauptseite.
---
```

The `description` is rendered at the top of the page. Keep it **short and
objective**: state what the Component _is_ or _does_ in one concise sentence
(two at most). Do not address the reader, and drop filler such as „je nach
Bedarf".

The body of the page follows the structure described next.

---

## Component Page Structure

One page, ordered so a developer gets running fast and then goes deeper. The
**spine is fixed**; only the feature sections in the middle vary per Component.

```
---  component + short, objective description  ---
---                          (horizontal rule right after the frontmatter)
# Code-Beispiel     one integration-critical sentence + bare <LiveCodeEditor />
---
# Verwendung        „Verwende <X>, um …" bullet list
## Best Practices   short „… darauf, dass …" bullets
---
# <feature sections>  per Component; each has its own example; common → niche
---
# Kombiniere mit …    one ## per other Component genuinely composed with
---
# Properties          <PropertiesTables />
```

Separators: a leading `---` right after the frontmatter, a `---` between every
top-level `#` section, and **none** between a `#` and its own `##`.
`# Code-Beispiel` is always first, `# Properties` always last.

### Code-Beispiel

Always the first section. Open with **one sentence naming the single most
important thing to get the integration right** — the key prop or the required
child structure, with code identifiers as inline code:

- Button: „Benutze das `onPress` Property …"
- TextField: „Nutze ein `<Label />` …"
- Modal: „… `<ModalTrigger />` … `<Heading />`, `<Content />` und optional eine
  `<ActionGroup />`."

This is _not_ a list of use cases (that belongs in `# Verwendung`). Follow the
sentence with a bare `<LiveCodeEditor />`, which renders the implicit
`examples/default.tsx`.

### Verwendung and Best Practices

`# Verwendung` states what the Component is for as a „Verwende <X>, um …" bullet
list. In prose, link the Components it typically works with.

`## Best Practices` (a `##` directly under `# Verwendung`) is a short bullet
list opening with „Achte bei der Verwendung einer/eines X darauf, dass …". Keep
each bullet to one idea. This is where the actionable essence of the former
Guidelines content lands — including accessibility and wording nuggets that are
not tied to a specific feature section.

### Feature sections

The variable middle of the page. A capability earns its own `#` section **only
when it warrants its own meaningful live example**. No example → no section (at
most a Best-Practice bullet).

- **Order:** the shared visual axes first, in the fixed relative order
  **Variants → Color → Sizes → States** where the Component has them, then
  Component-specific sections from common to niche (Button: `# Content`;
  TextField: `# Value` → `# Input Properties` → `# Character Count` →
  `# Validierung` → `# Disabled`; Modal: `# OffCanvas` → `# Sizes` →
  `# Ungespeicherte Änderungen` → `# Show CloseButton` → `# Controller`).
- **One bullet list per section**, not one paragraph per option. Where the old
  page explained each option as its own bold-term paragraph
  (`**Solid:** Die Solid-Variant …`), collapse it into a single bulleted list.
- A Component's **own** content (a Button's icon/text, a TextField's password
  toggle) stays here as a feature section. Composition with **another**
  Component goes under `# Kombiniere mit …` instead.
- Attach accessibility notes to the section they belong to — for example the
  `aria-label` guidance for an icon-only Button lives in its `# Content`
  section, not in a separate `# Accessibility` block.

### Kombiniere mit …

One `##` per **other, named Component** this one is genuinely composed with,
each with a link to that Component's page and its own example (Button:
`## Align` / `## ActionGroup` / `## Action`; TextField: `## Align` / `## Button`
/ `## ContextualHelp` / `## React Hook Form`).

- **Omit the whole section** when there is no genuine composition — do not
  invent one.
- **`## React Hook Form` is the fixed convention** for form-capable Components:
  always add it, linking to the
  [Form (React Hook Form)](/04-components/react-hook-form/form/overview) page.

### Properties

Always the last section: a `# Properties` heading containing
`<PropertiesTables />`, which renders the props documentation generated from the
prop JSDoc.

---

## Distilling Content

Rules for turning the older, verbose three-tab content into a single lean page.
The guiding principle: **condense, don't delete.** Meaningful content survives —
shorter, sharper, and moved to the matching part of the new structure. Only
content that does not move a developer forward is dropped.

- **Three instruction voices**, in order of how often they appear:
  1. **Recommend** (the default): „Verwende … um …", „Achte darauf, dass …".
  2. **Describe automatic behaviour**: things the Component does on its own are
     stated as facts, not instructions — „Sobald `target="_blank"` gesetzt ist,
     wird automatisch das `IconExternalLink` angezeigt."
  3. **Forbid** (rare): „Vermeide es, …".
- **Per-item prose → one bullet list.** Merge repeated bold-term paragraphs into
  a single list.
- **Former Guidelines sections:** only `# Verwendung` and `## Best Practices`
  survive as headings. Resolve everything else in this priority: _fold into the
  matching feature section → fold into a single Best-Practice bullet → drop._
  This is **exceptionless** — there is no standalone `# Accessibility`,
  `# Writing Guidelines`, or `# Verhalten`. Accessibility attaches to the theme
  it concerns.
- **Do/Dont blocks are removed by default.** Convert the actionable point into a
  Best-Practice bullet. Keep a visible `<Do>`/`<Dont>` only as an **absolute
  exception**: a genuine antipattern a developer easily gets wrong.
- **Merge duplicates** (a Sizes explanation that appeared in both Overview and
  Guidelines becomes one `# Sizes`), and **dissolve wrapper headings**
  (`# Grundlagen`, `# Anwendung`, `# Inhalt`): promote their meaningful children
  to top-level sections and drop the empty container.
- **Orphaned examples:** dropping a section leaves its `examples/*.tsx` unused.
  Leave them in place while editing; remove the now-unreferenced files in a
  final cleanup commit. Never delete `examples/default.tsx` or any file still
  referenced by a `<LiveCodeEditor example="…" />`.

---

# Writing Guidelines

## Language

The Styleguide content is written in **German**.

- Component names and Design System terminology are never translated: write
  **Button**, **Section**, **Dialog** as well as Variants, Colors, Sizes,
  States, and Props.
- Headings are written in German (`# Verwendung`, `# Kombiniere mit ...`).
  Established technical terms remain English — for example `Code-Beispiel`,
  `Best Practices`, `Properties`, and property names such as `Disabled`.
- English headings and terms use title case: every main word is capitalized
  (`## Best Practices`, `# Show CloseButton`). German headings follow regular
  German orthography — function words stay lowercase and sentence-like headings
  remain unchanged (`# Ungespeicherte Änderungen`, `# Kombiniere mit ...`).

## Tone of Voice

The Styleguide is technical documentation. Three writing modes are used,
depending on what a passage does:

**Descriptions** explain what a Component is or how it behaves. Write them in a
clear and objective style, focused on the Component — do not address the reader.

Good:

> Die Section sorgt automatisch für Abstände zwischen den darin platzierten
> Elementen.

Avoid:

> Du bekommst automatisch Abstände zwischen den Elementen.

**Instructions** tell the reader how to use a Component correctly (Best
practices, Verwendung). Write them as direct imperatives in the informal
du-form:

> Verwende eine Section, um Content in kleinere Teilbereiche zu gliedern.

> Achte bei der Verwendung eines Buttons darauf, dass er leicht zu finden ist.

Avoid indirect or passive phrasings ("man sollte", "es wird empfohlen") where an
imperative is clearer.

**Automatic behaviour** is what the Component does on its own, without the
developer doing anything. State it as a fact — do not phrase it as an
instruction:

> Sobald `target="_blank"` gesetzt ist, wird automatisch das `IconExternalLink`
> angezeigt.

Not:

> Setze `target="_blank"` und zeige das `IconExternalLink` an.

## Component Names

Never translate Component names or Design System terminology.

Use:

- **Button**
- **Section**
- **Dialog**

instead of translated equivalents.

When a Component name appears in prose, link it to the Component's page (see
[Links](#links)). Write the name in plain text when it is mentioned repeatedly
or when no page exists for it (for example sub-elements such as SectionAction).

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

Use bold sparingly to emphasize important terms, and for option names in a
bullet list followed by their explanation (for example
`**Solid** für Hauptaktionen …`).

Do not use bold for Component names in prose — link them instead — and never for
code identifiers.

### Links

Use inline links generously to connect related documentation.

- Component names in prose link to the Component's page:
  `[Section](/04-components/structure/section/overview)`.
- Links are root-relative (starting with `/01-get-started`, `/02-foundations`,
  `/03-patterns`, or `/04-components`).
- Verify a link target exists before adding it, and avoid linking to the same
  page multiple times within a short section unless it improves readability.

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

- Use `#` for the top-level sections of a page — for example `# Code-Beispiel`,
  `# Verwendung`, `# Kombiniere mit ...`. A page usually has several `#`
  sections.
- Separate `#` sections from each other with a horizontal rule (`---`). Do not
  put a rule between a `#` and its own `##`.
- `#` and `##` headings appear in the anchor navigation ("Auf dieser Seite").
  Keep them concise so the navigation remains readable.

---

# Page Building Blocks

The most important MDX Components for writing content:

- `<LiveCodeEditor />` — renders an interactive code example, and the primary
  building block of a Component page. Without an `example` prop it uses
  `examples/default.tsx`; with `example="name"` it renders `examples/name.tsx`
  from the `examples` directory next to the MDX file. Common props:
  `editorCollapsed` (code initially hidden), `editorDisabled` (no editor), `row`
  (side-by-side grid), `bgColor`, `zoom`, `stretch`.
- `<PropertiesTables />` — renders the generated props documentation in the
  `# Properties` section.
- `<Alert>` with `<Heading>` and `<Content>` — highlighted notes.
- `<Do example="...">` / `<Dont example="...">` / `<DoAndDont>` / `<Plain>` /
  `<Info>` — visual good/bad usage examples. **Use only as an exception.** These
  are carried over from the older three-tab Guidelines and are visually heavy;
  the default is to express the point as a Best-Practice bullet. Reach for a
  visible Do/Dont only for a genuine antipattern a developer easily gets wrong.

Frontmatter:

- Component `index.mdx`: `component` (the Component name) and `description` (the
  introduction — one short, objective sentence).
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
