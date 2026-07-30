import type { Release } from "./types";

const commitUrl = (sha: string) =>
  `https://github.com/mittwald/flow/commit/${sha}`;

// Curated release notes follow .claude/templates/release-notes.md: a punchy
// `title` headline, user-facing `highlights`, then a `body` of per-feature
// `## ` sections (plus optional Deprecations/Migrations). Minor/major only —
// fixes are surfaced separately per patch version, never in the body.
export const dummyReleases: Release[] = [
  {
    version: "1.1.0",
    kind: "minor",
    date: "2026-08-14",
    isLatest: true,
    title: "Project overview cards and a calmer default table",
    highlights: [
      "Summarise a hosting project at a glance with the new `ProjectOverviewCard`.",
      "`Table` now defaults to a calmer, lighter row separator.",
      "`Combobox` supports an async loading state for options fetched on demand.",
    ],
    body: [
      "## Deprecations",
      "",
      '- The `Table` `dense` prop is deprecated in favour of `spacing="compact"`. The old prop keeps working and logs a warning via `useWarnDeprecation`; see MIGRATION.md. (#2711)',
      "",
      "## ProjectOverviewCard",
      "",
      "A compact card that summarises a hosting project — its plan, members and current status — so overview screens no longer need a bespoke layout. (#2705)",
      "",
      "```tsx",
      "<ProjectOverviewCard",
      "  project={project}",
      "  onOpen={() => navigate(`/projects/${project.id}`)}",
      "/>",
      "```",
      "",
      "## Quieter table separators",
      "",
      '`Table` now uses a lighter row separator by default, which reads calmer in dense data views. Pass `separators="strong"` to keep the previous, more prominent borders. (#2708)',
      "",
      "## Async Combobox loading",
      "",
      "`Combobox` gained a first-class loading state for options fetched on demand, so you can show a spinner while results resolve instead of an empty menu. (#2712)",
    ].join("\n"),
    npmUrl:
      "https://www.npmjs.com/package/@mittwald/flow-react-components/v/1.1.0",
    githubUrl: "https://github.com/mittwald/flow/releases/tag/1.1.0",
    patchGroups: [
      {
        version: "1.1.2",
        date: "2026-08-28",
        fixes: [
          {
            text: "Combobox: keep focus on the input after selecting an item",
            commitSha: "a1b2c3d",
            commitUrl: commitUrl("a1b2c3d"),
          },
          {
            text: "ProjectOverviewCard: correct plan label truncation on narrow cards",
            commitSha: "b2c3d4e",
            commitUrl: commitUrl("b2c3d4e"),
          },
        ],
      },
      {
        version: "1.1.1",
        date: "2026-08-21",
        fixes: [
          {
            text: "Table: restore keyboard row navigation in the quiet style",
            commitSha: "c3d4e5f",
            commitUrl: commitUrl("c3d4e5f"),
          },
        ],
      },
    ],
  },
  {
    version: "1.0.0",
    kind: "major",
    date: "2026-07-31",
    isLatest: false,
    title: "Flow 1.0 — the stable design system",
    highlights: [
      "The public API is now covered by a semver contract — adopt `^1` with confidence.",
      "Remote rendering for mStudio extensions is promoted to stable.",
    ],
    body: [
      "## Stable public API",
      "",
      "Every component's props and behaviour are now covered by a semver contract: breaking changes only land in a new major, so you can adopt `^1` with confidence. (#2700)",
      "",
      "## Remote rendering is stable",
      "",
      "The remote-DOM rendering path used by mStudio extensions graduates from preview to stable and is now part of the versioning contract. (#2702)",
      "",
      "## Migrations",
      "",
      "- Update to `@mittwald/flow-react-components@^1`.",
      "- Props deprecated during the alpha series have been removed. Run the codemod, then follow MIGRATION.md for the remaining manual steps. (#2701)",
      "",
      "```bash",
      "npx @mittwald/flow-codemods v1-remove-deprecated",
      "```",
    ].join("\n"),
    npmUrl:
      "https://www.npmjs.com/package/@mittwald/flow-react-components/v/1.0.0",
    githubUrl: "https://github.com/mittwald/flow/releases/tag/1.0.0",
    patchGroups: [
      {
        version: "1.0.1",
        date: "2026-08-07",
        fixes: [
          {
            text: "Button: fix icon vertical alignment in the small size",
            commitSha: "d4e5f6a",
            commitUrl: commitUrl("d4e5f6a"),
          },
        ],
      },
    ],
  },
  {
    version: "0.9.0",
    kind: "minor",
    date: "2026-07-10",
    isLatest: false,
    title: "Pre-1.0 stabilisation",
    highlights: [],
    body: [
      "## API polish ahead of 1.0",
      "",
      "Final naming and default-value adjustments across the form components, so the 1.0 surface is consistent. No action required. (#2698)",
    ].join("\n"),
    npmUrl:
      "https://www.npmjs.com/package/@mittwald/flow-react-components/v/0.9.0",
    githubUrl: "https://github.com/mittwald/flow/releases/tag/0.9.0",
    patchGroups: [],
  },
];
