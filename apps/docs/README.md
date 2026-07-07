# flow Styleguide Content Guidelines

This document describes the structure, purpose, and writing conventions of the
**flow Styleguide**. It serves as a reference for everyone creating or
maintaining documentation within the design system and helps ensure consistency
across all content.

The flow Styleguide is the public documentation of the flow Design System. It
not only documents Components but also communicates design principles and best
practices for building user-centered interfaces with flow.

## Styleguide

The Styleguide is available at:

https://flow.mittwald.de/

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

- Typography
- Color
- Layout principles
- Content guidelines
- Complex design concepts such as error handling

The internal structure of this section may evolve over time.

### Patterns

**Patterns** document common user flows and interactions involving multiple
Components.

They demonstrate recurring solutions through concise code examples that can
easily be reused. Code examples should remain compact to avoid excessive
scrolling.

Smaller implementation examples belong in **Code Snippets** instead.

### Components

Each Component has its own documentation page describing its purpose, API, and
usage.

Every Component page begins with a short introduction explaining what the
Component is used for. This introduction should be as concise as
possible—typically one to three sentences are sufficient.

Each Component page contains three tabs:

- Overview
- Develop
- Guidelines

---

## Component Tabs

### Overview

The **Overview** tab provides a quick technical introduction to a Component.

Its primary goal is to help developers understand how to use the Component with
minimal reading.

The recommended structure is:

1. **Playground**

- A representative example that can easily be copied.
- Notes about implementation details or important considerations.

2. **Variants**

- Available variants of the Component.

3. **Additional properties**

- For example Colors, Sizes, or similar options.

4. **States**

- Demonstrates the supported Component states.

5. **Combine with...**

- Explains how the Component integrates with other Components.

### Develop

The **Develop** tab focuses on the technical implementation of the Component.

Typical contents include:

- Props
- Technical implementation details
- Solutions for advanced use cases
- Implementation-specific guidance

### Guidelines

The **Guidelines** tab explains **when** and **why** a Component should be used.

While the Overview describes _how_ to implement a Component, the Guidelines
focus on proper usage.

The recommended structure is:

1. Introduction
2. Best Practices
3. Typical Use Cases
4. Comparison with similar Components (for example, Button vs. Link)
5. Application
6. Writing Guidelines
7. Behavior
8. Accessibility

#### Writing Guidelines

This section describes the content displayed inside the Component.

Depending on the Component, this may include:

- Labels
- Text
- Icons
- Illustrations

#### Behavior

Describes how the Component behaves in different situations, such as responsive
layouts or interaction states.

#### Accessibility

Documents accessibility considerations specific to the Component.

---

# Writing Guidelines

## Tone of Voice

The Styleguide is technical documentation.

Therefore:

- Write in a clear and objective style.
- Avoid directly addressing the reader ("you") whenever possible.
- Focus on the Component and its behavior instead of the user.

Good:

> The Button is clickable.

Avoid:

> You can click the Button.

## Component Names

Never translate Component names or Design System terminology.

Use:

- **Button**
- **Section**
- **Dialog**

instead of translated equivalents.

This also improves consistency and simplifies linking throughout the
documentation.

## Code, Bold and Links

### Inline Code

Use inline code for everything that appears exactly as written in the
implementation, including:

- HTML elements
- Props
- Component names in code
- CSS classes
- Tokens

Inline code should only be used for code-related identifiers, not for emphasis.

### Bold

Use **bold** when referring to the name of a Component in prose rather than its
implementation.

Bold may also be used sparingly to emphasize important terms.

### Links

Use inline links generously to connect related documentation.

Avoid linking to the same page multiple times within a short section unless it
improves readability.

## Headings

- Use only one H1 per page.
- Separate H2 sections with a horizontal rule (`---`).
- Keep headings concise so the table of contents remains readable.

---

# Quality Assurance

Before publishing documentation:

- Review grammar and spelling.
- Ensure terminology follows this guide.
- Verify that links are correct.
- Keep content concise and consistent.
- AI-based proofreading tools may be used to support the review process.
