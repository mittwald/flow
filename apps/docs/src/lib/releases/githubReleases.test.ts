import { expect, test } from "vitest";
import { groupFixes, parseFixes, splitHeadline } from "./githubReleases";

test("takes the leading H1 as the headline and drops it from the body", () => {
  expect(
    splitHeadline(
      "# Upgrade with one command\n\n## Highlights\n\n- Something\n",
    ),
  ).toStrictEqual({
    headline: "Upgrade with one command",
    body: "## Highlights\n\n- Something\n",
  });
});

test("keeps an H1 that is not the first content", () => {
  const body = "Intro.\n\n# Not a headline\n";
  expect(splitHeadline(body)).toStrictEqual({ body });
});

test("ignores a deeper heading", () => {
  const body = "## Highlights\n\n- Something\n";
  expect(splitHeadline(body)).toStrictEqual({ body });
});

test("handles an empty body", () => {
  expect(splitHeadline("")).toStrictEqual({ body: "" });
});

const commit = (sha: string) =>
  `([${sha}](https://github.com/mittwald/flow/commit/${sha}0000000000000000000000000000000000))`;

test("keeps only consumer sections and drops internal scopes", () => {
  const body = [
    "## [1.5.39](https://github.com/mittwald/flow/compare/1.5.38...1.5.39) (2026-10-23)",
    "",
    "### Bug Fixes",
    "",
    `* **ci:** always resolve the latest Node 24 patch release ${commit("ef88a48")}`,
    `* **Table:** mark only the first column as row header ${commit("55f4233")}`,
    "",
    "### Tests",
    "",
    `* update visual regression screenshots ${commit("de6b78a")}`,
    "",
    "### Performance Improvements",
    "",
    `* **List:** skip unchanged items ([#3581](https://github.com/mittwald/flow/issues/3581)) ${commit("c32379a")}`,
  ].join("\n");

  expect(
    parseFixes(body).map(({ scope, text }) => ({ scope, text })),
  ).toStrictEqual([
    { scope: "Table", text: "mark only the first column as row header" },
    { scope: "List", text: "skip unchanged items" },
  ]);
});

test("merges the fixes of one scope and keeps unscoped fixes apart", () => {
  const fix = (scope: string | undefined, text: string, sha: string) => ({
    scope,
    text,
    commitSha: sha,
    commitUrl: `https://github.com/mittwald/flow/commit/${sha}`,
  });

  expect(
    groupFixes([
      fix("Table", "mark only the first column as row header", "55f4233"),
      fix(undefined, "require Node 24", "caf4627"),
      fix("Modal", "read the open state", "7c48cef"),
      fix("Table", "render row header cells as cells", "a728cf3"),
      fix(undefined, "drop a stray file", "1234567"),
    ]).map(({ scope, texts }) => ({ scope, texts })),
  ).toStrictEqual([
    {
      scope: "Table",
      texts: [
        "mark only the first column as row header",
        "render row header cells as cells",
      ],
    },
    { scope: undefined, texts: ["require Node 24"] },
    { scope: "Modal", texts: ["read the open state"] },
    { scope: undefined, texts: ["drop a stray file"] },
  ]);
});
