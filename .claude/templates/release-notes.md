<!--
  Release-notes template for a minor/major promotion (next → main).
  Claude drafts the curated notes into THIS shape; the maintainer then edits.

  Authoring rules:
  - Audience: extension developers & Flow consumers. Write user-facing prose,
    not commit subjects.
  - Inline code only for what the reader types or matches: prop names, values,
    commands, symbols, package names. Version numbers and component names in
    running prose stay plain — a paragraph of code chips stops the eye at every
    token.
  - Minor/major only — patches release separately, so there is NO Fixes section.
    Fold a user-relevant fix into the related feature's text if it matters.
  - Drop noise entirely: chore/deps/release bumps, internal refactors, CI.
  - Drop the host side. The audience runs on the remote side; the mStudio host
    ships with mStudio itself, so its contract never needs a release note or a
    migration. Judge per symbol, not per package: remote-core is host-only
    (e.g. `HostExports`, `RemoteExtBridgeConfig`), and the extension-facing
    ext-bridge carries host types too (e.g. `HostConfig`,
    `ExtBridgeConfigInput`).
  - Group by feature/area, never by commit. One "## " section per notable
    feature; link its PR(s), e.g. (#1234).
  - Screenshots: capture them, never fabricate them. A capture of a real
    Styleguide example rendered from the release branch is not a fabrication —
    a mocked, drawn or generated image is, and stays forbidden. Storybook
    stories are no source: their Star Wars fixtures do not belong on the docs
    site. `/prepare-release` step 8 produces the figures with
    `pnpm release:figure`; a feature with no example (a CLI, a build change)
    simply gets none. Code examples are fine when grounded in the
    real API.
  - Delete these comments and every unused/empty section in the final text.
-->

# {{ Punchy one-line headline summarising the release }}

## Highlights

<!-- 3–6 bullets, each one user-facing sentence; the skim-readable summary. -->

- …

## Deprecations

<!-- APIs newly deprecated this release (via useWarnDeprecation). Deprecations
     are non-breaking (the old API still works and only warns), so this section
     belongs in minors too, not just majors. Per item: the replacement path,
     plus its MIGRATION.md entry and, where one exists, the codemod id to run
     with `npx @mittwald/flow-codemods@latest <id> src`. Delete the section if
     there are none. -->

- …

## {{ Feature name }}

<!-- One section per notable feature. Short paragraph: what it is and why it
     matters. Add a code example when it aids adoption. Repeat as needed. -->

{{ description }}

```tsx
// optional usage example, grounded in the real component API
```

<!-- DELETE this line when the feature has no example to capture (a CLI, a
     build change) — an unfilled image link is worse than no figure.

     Otherwise: one captured figure per notable feature, never one per prop
     variant — compose the variants into a single image. Paste the <picture>
     block `pnpm release:figure` prints, unchanged: GitHub shows its <source> in
     dark mode, and /releases rewrites exactly this shape into one image per
     theme (its <Markdown> drops any other raw HTML, an <img> included). -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mittwald/flow/{{FIGURE_SHA}}/apps/docs/public/assets/releases/{{VERSION}}/{{name}}-dark.png">
  <img src="https://raw.githubusercontent.com/mittwald/flow/{{FIGURE_SHA}}/apps/docs/public/assets/releases/{{VERSION}}/{{name}}.png" alt="{{ caption }}">
</picture>

## Migrations

<!-- Only when there is something to migrate — delete this whole section if
     there are no breaking changes with migration steps (typically the case for
     a minor). Per breaking change: what changed, why, and the concrete
     migration step. Link MIGRATION.md, and name the codemod id where one
     exists. Lead the section with the one-liner that covers the whole range:
     `npx @mittwald/flow-codemods@latest upgrade`. -->
