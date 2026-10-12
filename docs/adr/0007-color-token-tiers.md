# ADR 0007 – Color token tiers

- **Status:** Accepted
- **Date:** 2026-10-12
- **Deciders:** Flow team, UX (j.eimertenbrink@mittwald.de)
- **Affects:** color tokens in `packages/design-tokens` (files, references and
  the per-theme CSS build), color usage in `packages/components` and
  `apps/docs`, the docs pages `foundations/design/design-tokens` and
  `foundations/design/colors`, and the migration catalogue

> This ADR fixes **what each color token tier is responsible for and what it may
> reference**. It covers colors only; size, border, font and other tokens keep
> their tiers as they are. Decided in
> [#3450](https://github.com/mittwald/flow/issues/3450), part of the brand color
> effort [#3448](https://github.com/mittwald/flow/issues/3448). The research
> behind it is [#3451](https://github.com/mittwald/flow/issues/3451). The
> concrete Semantic roles are
> [#3455](https://github.com/mittwald/flow/issues/3455).

## Context

Flow adopts the new mittwald brand. Before the colors change, the tiers they
flow through need a clear job each. Today:

- **The light/dark switch lives in Global.** `color-palette.dark.yml` inverts
  the ramps, so `gray.100` is white in light and near-black in dark. The build
  emits only `color.*` tokens per theme; every other tier is emitted once as
  `var()` references and switches by inheritance.
- **Alias 1 mirrors Global 1:1** (`primary.color.100–1100` →
  `hosting-blue.100–1100`). It adds no decision.
- **Tiers are bypassed.** 81 component token references point at Global
  (`badge.yml` alone 54), justified by the "purely decorative" exception in the
  Design Tokens docs. Alias 2 points at Global for `transparent`. Component
  SCSS/TS reads Global CSS variables directly (`super-teal`,
  `soft-contrast-violet`, `categorical`, `code-syntax`, `background-gradient`).
- **Alpha ramps exist twice in Global.** `black-alpha`/`white-alpha` swap per
  theme; `static-black-alpha`/`static-white-alpha` hold the same values in both
  themes.
- **Nothing checks references.** No rule says which tier may reference which, so
  the bypasses above accumulated unnoticed.

An inverted palette only works when step numbers carry a fixed contrast meaning
in both themes (Spectrum). Flow's steps do not. And a brand palette that inverts
per theme decides how Flow uses the brand, which is not the palette's job.

## Decision

Four color tiers, renamed after their job:

| Tier (former name)     | Responsibility                                                                                                                    | Per theme | May reference                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| **Brand** (Global)     | The palette from the brand handover. Theme-neutral: one value per token.                                                          | no        | nothing — literal values only         |
| **Semantic** (Alias 1) | Colors with a meaning: surfaces, content, borders, status and decorative colors. **The only tier that distinguishes light/dark.** | yes       | Brand; literal values (see below)     |
| **Variant** (Alias 2)  | Pairs of Semantic colors per variant: `solid`, `soft`, `plain`, `outline` × status or decorative color.                           | no        | Semantic only                         |
| **Component**          | Decisions of a single component.                                                                                                  | no        | Variant or Semantic — **never Brand** |

**Origin decides between Brand and Semantic.** Brand holds what marketing hands
over, nothing else — including `black-alpha` and `white-alpha`, and the brand
gradients once they are approved. Semantic holds what the design system decides.
Dark-theme colors are a Semantic decision and usually reference a Brand color,
often the mirrored step. Semantic holds literal values only where Flow owns the
color outright:

- `code-syntax` and `categorical`
- the current `gradient` and `background-gradient`, until brand gradients
  replace them

**Variant for variants, Semantic for single colors.** A component token whose
color belongs to a variant (Button, Badge, Alert) references the Variant pair. A
color that stands alone — text, border, surface, focus — references Semantic
directly. Single colors do not get a Variant mirror.

**No exception for decorative colors.** A decorative color needs a different
value in dark just like any other, so it gets Semantic roles like any other. The
"purely decorative" exception is removed from the Design Tokens docs.

**Alpha ramps.** Brand keeps `black-alpha` and `white-alpha` with fixed values;
`static-black-alpha` and `static-white-alpha` are removed. Semantic keeps four
groups:

- `dark` → `black-alpha` in light, `white-alpha` in dark; `light` the reverse.
- `dark-static` → always `black-alpha`; `light-static` → always `white-alpha`.

`transparent` becomes a Semantic color, so Variant needs no Brand reference.

**Code follows the component rules.** Component SCSS/TS reads Variant or
Semantic CSS variables, preferably through a component token — never a Brand
variable. Exception: docs pages that display the palette itself, where the Brand
value is the content.

**Enforcement.**

- `build-tokens.js` assigns every color token file to a tier and fails the build
  on a reference the table above forbids. It lands in the color PR.
- A lint rule against Brand CSS variables (`var(--color--…)`) in code is a
  separate ticket.

## Consequences

**Positive**

- Each tier has one job, and a reference that bypasses one fails the build
  instead of piling up.
- A brand change touches Brand only. A theme decision touches Semantic only.
- Dark-theme colors become explicit decisions per role rather than a side effect
  of inverting a ramp.

**Negative / accepted cost**

- **The build changes shape.** It emits Semantic tokens per theme instead of
  Brand. Files become `color-brand.yml`, `color-semantic.light.yml`,
  `color-semantic.dark.yml` and `color-variant.yml`, following the existing
  `.light`/`.dark` suffix convention.
- **All bypasses must be rewired at once:** 81 component token references, the
  `transparent` references in Variant, and direct Brand variables in component
  SCSS/TS.
- **Consumers break silently.** A consumer reading `var(--color--gray--100)` in
  their own CSS gets the light value in dark after the change; the
  `static-*-alpha` variables disappear. Token names and values are outside the
  semver contract ([ADR 0005](0005-semver-contract.md)), so this ships as a
  Minor on `next`. A migration catalogue entry (`action: manual`, no codemod —
  whether `gray.100` meant a surface or content is not decidable mechanically)
  tells consumers to move to Semantic or Variant.
- **The tier names change in docs and Figma** ("Global / Alias 1 / Alias 2" →
  "Brand / Semantic / Variant"). They appear in no CSS variable name.

## Non-goals

- **The Semantic roles themselves** — names, count, tones per theme. That is
  [#3455](https://github.com/mittwald/flow/issues/3455).
- **Brand gradient values.** They enter Brand once marketing approves them.
- **Non-color tiers.** Size tokens reference their Global tier directly and have
  no theme, so neither the reference rule nor the origin rule applies.
