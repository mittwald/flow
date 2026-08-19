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
# Best Practices    flat checklist: **bold directive** + optional reason
## <A> vs. <B>      optional; only for a genuinely confusable Component pair
---
# <feature sections>  per Component; each has its own example; common → niche
---
# Kombiniere mit …    one ## per other Component genuinely composed with
---
# <dev edge case>     rare dev-only note (e.g. Suspense ordering); just above Properties
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

This is _not_ a list of use cases — the Component's purpose belongs in the
`description` frontmatter. Follow the sentence with the `<LiveCodeEditor />`
that renders the implicit `examples/default.tsx`. A single `<Alert>` may sit
between the sentence and the editor when it flags an integration-critical caveat
(for example Select's dynamic-`Options` `key` warning).

For a Component with genuinely no props and no required child structure (for
example LoadingSpinner), the opening sentence may be omitted — the section then
starts directly with the bare `<LiveCodeEditor />`.

### Best Practices

The single entry point to a Component's guidance: a flat checklist a developer
scans once to know **what to watch out for when using this Component** — across
accessibility, interplay with other Components, higher-level patterns (for
example Forms), and Component-specific rules.

- **Flat bullet list, most important first.** No sub-headings, no shared opening
  sentence.
- **Each bullet is a bold directive followed by an optional reason.** The
  directive is a full imperative sentence in du-form ending with a period; the
  reason, when present, is a separate plain sentence after it. Do not join the
  two with a dash. Drop the reason when the rule is self-evident. Example:
  „**Wähle zu Beginn eine sinnvolle Option vor.** Das vermeidet unnötige
  Fehlermeldungen."
- **Lead with the purpose, phrased as a recommendation** — say what to do and
  why it helps, not the threshold, the mechanism, or what goes wrong. Good:
  „**Nutze bei vielen Optionen ein Select, um die Oberfläche aufgeräumt zu
  halten.** Als Faustregel ab etwa sieben Optionen." Avoid: „Wechsle ab sieben
  Optionen zum Select, sonst wird die Oberfläche unübersichtlich."
- **Keep bullets short, plain, and factual.** Stay professional and technical;
  cut clauses that confuse more than they help; avoid colloquial filler
  („ebenso") and dramatic words („riskant" → „mit weitreichenden Folgen").
- **Comprehensive and authoritative for the rule.** Every consideration that
  matters at a glance appears here. Feature sections below only _elaborate_ a
  rule (example, Do/Dont, rationale); they never introduce a rule the checklist
  omits. A bullet may link inline to a section or page that goes deeper, but the
  link is optional — no arrow prefix, no forced cross-reference.
- **Higher-level patterns are normal bullets with an inline link,** shown only
  when they matter (often as the first bullet): „**Folge in einem Formular dem
  [Form-Pattern](…).** Dort sind Aufbau, Validierung und Fehlerbehandlung
  geregelt."
- **Soft cap of roughly 5–8 bullets.** If a rule needs more than a bold sentence
  plus one reason sentence, move the depth into a feature section and let the
  bullet summarise. A longer list signals that something belongs in its own
  section.

A Component's **purpose** (the former „Verwende <X>, um …" use cases) is not a
section — it lives in the one-sentence `description` frontmatter, which stays
short on purpose. Use-case bullets are dropped; a genuinely useful one becomes a
Best-Practice bullet. Do not grow the description to hold them.

An optional `## <A> vs. <B>` comparison may follow the checklist as a `##` under
`# Best Practices` — but **only when it clarifies a genuine choice between two
similar Components** a developer could confuse (for example
`## Checkbox vs. Switch`). Present it as a short intro sentence plus a
`<DoAndDont>` of two `<Plain>` tiles („Verwende eine <A>, um …" / „Verwende
einen <B>, um …"). Omit it when the distinction is thin or purely visual — a
one-line note in the Best-Practices prose is enough then.

### Feature sections

The variable middle of the page. A capability earns its own `#` section **only
when it warrants its own meaningful live example**. No example → no section (at
most a Best-Practice bullet). Exception: a section may stand without a live
example when it documents essential reference or behaviour that no example
conveys better — for example ColumnLayout's breakpoint values or List's
`<List.Search />` props.

- **Order:** the shared visual axes first, in the fixed relative order
  **Variants → Color → Sizes → States** where the Component has them, then
  Component-specific sections from common to niche (Button: `# Content`;
  TextField: `# Value` → `# Input Properties` → `# Character Count` →
  `# Validierung` → `# Disabled`; Modal: `# OffCanvas` → `# Sizes` →
  `# Ungespeicherte Änderungen` → `# Show CloseButton` → `# Controller`). A lone
  peripheral state — most often `# Disabled` — goes **last**, after the
  Component-specific feature sections (as in TextField), not in the early States
  slot.
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
- **Only Components with their own page belong here.** A helper that has no page
  and cannot be used standalone (for example `FieldDescription`) stays a feature
  section, never under Kombiniere.
- **Two closely related sibling Components** a developer chooses between (for
  example AlertBadge / Badge) may share a single `##`, as long as the heading
  names both and one example shows them together.
- **`## React Hook Form` is the fixed convention** for form-capable Components:
  always add it, linking to the
  [Form (React Hook Form)](/04-components/react-hook-form/form/overview) page. A
  simple toggle-style Component that ships no dedicated form example (for
  example Switch) may omit it.

### Dev edge cases

A rare, developer-only concern that is neither a user-facing feature nor a
composition with another Component — typically a code snippet, not a live
example. It gets its own `#` section placed **directly above `# Properties`**,
after `# Kombiniere mit …`. Example: ActionGroup's `# Reihenfolge der Buttons`
(wrap re-rendering children in `Suspense` to keep the button order stable). Do
not invent one — only lift a genuine edge case out of the feature sections.

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
  1. **Recommend** (the default): imperative directives — „Halte …", „Setze …",
     „Nutze …", „Achte darauf, dass …".
  2. **Describe automatic behaviour**: things the Component does on its own are
     stated as facts, not instructions — „Sobald `target="_blank"` gesetzt ist,
     wird automatisch das `IconExternalLink` angezeigt."
  3. **Forbid** (rare): „Vermeide es, …".
- **Per-item prose → one bullet list.** Merge repeated bold-term paragraphs into
  a single list.
- **Former Guidelines sections:** only `# Best Practices` survives as a heading
  (a top-level `#`). The former `# Verwendung` use-case list does not — its
  purpose folds into the `description` frontmatter. Resolve everything else in
  this priority: _fold into the matching feature section → fold into a single
  Best-Practice bullet → drop._ This is **exceptionless** — there is no
  standalone `# Accessibility`, `# Writing Guidelines`, or `# Verhalten`.
  Accessibility attaches to the theme it concerns, or becomes a Best-Practice
  bullet when it is not tied to a specific feature section.
- **Do/Dont blocks are removed by default.** Convert the actionable point into a
  Best-Practice bullet. Two exceptions keep a visible block: a `## <A> vs. <B>`
  component comparison under `# Best Practices` (see above), and — rarely — a
  genuine antipattern a developer easily gets wrong.
- **Merge duplicates** (a Sizes explanation that appeared in both Overview and
  Guidelines becomes one `# Sizes`), and **dissolve wrapper headings**
  (`# Grundlagen`, `# Anwendung`, `# Inhalt`): promote their meaningful children
  to top-level sections and drop the empty container.
- **Condense, don't re-invent.** Keep the original bullet's meaning and wording;
  change structure and voice for the checklist, not the substance or the reason.
  When you rewrite a rationale from scratch, you tend to introduce a claim the
  author never made.
- **Verify mentioned Components are current.** When a bullet names or links
  another Component, check it still exists and is not deprecated (for example
  Tabs → TabNavigation). Flag anything you are unsure about instead of guessing.
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
- Headings are written in German (`# Kombiniere mit ...`,
  `# Ungespeicherte Änderungen`). Established technical terms remain English —
  for example `Code-Beispiel`, `Best Practices`, `Properties`, and property
  names such as `Disabled`.
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

**Instructions** tell the reader how to use a Component correctly (Best-Practice
bullets, vs-comparison tiles). Write them as direct imperatives in the informal
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
  `# Best Practices`, `# Kombiniere mit ...`. A page usually has several `#`
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
  `<Info>` — visual good/bad usage examples. **Use sparingly.** Two legitimate
  uses remain: a `## <A> vs. <B>` component comparison under `# Best Practices`
  (a `<DoAndDont>` of two `<Plain>` tiles), and — rarely — a genuine antipattern
  a developer easily gets wrong. Otherwise express the point as a Best-Practice
  bullet.

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
