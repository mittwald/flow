<!--
  Release-notes template for a minor/major promotion (next → main).
  Claude drafts the curated notes into THIS shape; the maintainer then edits.

  Authoring rules:
  - Audience: extension developers & Flow consumers. Write user-facing prose,
    not commit subjects.
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
  - Screenshots/GIFs: leave the placeholder for the maintainer — do NOT
    fabricate images. Code examples are fine when grounded in the real API.
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
     plus a MIGRATION.md entry / codemod under packages/codemods where one
     exists. Delete the section if there are none. -->

- …

## {{ Feature name }}

<!-- One section per notable feature. Short paragraph: what it is and why it
     matters. Add a code example when it aids adoption. Repeat as needed. -->

{{ description }}

```tsx
// optional usage example, grounded in the real component API
```

<!-- ![caption](url) — maintainer adds a screenshot/GIF if useful -->

## Migrations

<!-- Only when there is something to migrate — delete this whole section if
     there are no breaking changes with migration steps (typically the case for
     a minor). Per breaking change: what changed, why, and the concrete
     migration step. Link MIGRATION.md and any codemod under packages/codemods. -->
