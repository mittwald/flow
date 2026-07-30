import type { Release } from "./types";

const commitUrl = (sha: string) =>
  `https://github.com/mittwald/flow/commit/${sha}`;

export const dummyReleases: Release[] = [
  {
    version: "1.1.0",
    kind: "minor",
    date: "2026-08-14",
    isLatest: true,
    title: "Project overview cards and a calmer default table",
    highlights: [
      "New `ProjectOverviewCard` for summarising hosting projects at a glance",
      "`Table` now defaults to a quieter row separator style",
      "`Combobox` gains an async loading state",
    ],
    body: [
      "## Features",
      "",
      "- **ProjectOverviewCard** — a compact card summarising a project's",
      "  plan, members and status. See the component docs for usage.",
      "- **Table** — the default border treatment is now lighter; pass",
      '  `separators="strong"` to restore the previous look.',
      "",
      "## Migration notes",
      "",
      "- If you relied on the old strong table separators, set",
      '  `separators="strong"` explicitly.',
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
      "First stable release with a committed semver contract",
      "Remote rendering promoted to stable",
    ],
    body: [
      "## Features",
      "",
      "- Stable public API across all components.",
      "- Remote DOM rendering is now covered by the versioning contract.",
      "",
      "## Migration notes",
      "",
      "- Update to `@mittwald/flow-react-components@^1`. Deprecated props",
      "  removed in the alpha series are gone — see MIGRATION.md.",
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
    body: ["## Features", "", "- Final API adjustments ahead of 1.0."].join(
      "\n",
    ),
    npmUrl:
      "https://www.npmjs.com/package/@mittwald/flow-react-components/v/0.9.0",
    githubUrl: "https://github.com/mittwald/flow/releases/tag/0.9.0",
    patchGroups: [],
  },
];
