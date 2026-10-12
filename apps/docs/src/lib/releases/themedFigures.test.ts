import { expect, test } from "vitest";
import { themedFigures } from "./themedFigures";

const base =
  "https://raw.githubusercontent.com/mittwald/flow/c2b3f6d/apps/docs/public/assets/releases/1.1.0";

const picture = [
  "<picture>",
  `  <source media="(prefers-color-scheme: dark)" srcset="${base}/rating-dark.png">`,
  `  <img src="${base}/rating.png" alt="Rating with &quot;maxValue&quot; [10]">`,
  "</picture>",
].join("\n");

test("turns a figure into one image per theme", () => {
  expect(themedFigures(`## Rating\n\n${picture}\n\n- More\n`)).toBe(
    [
      "## Rating",
      "",
      `![Rating with "maxValue" \\[10\\]](${base}/rating.png#light-only)`,
      `![Rating with "maxValue" \\[10\\]](${base}/rating-dark.png#dark-only)`,
      "",
      "- More",
      "",
    ].join("\n"),
  );
});

test("reads a block a formatter wrapped across lines", () => {
  const wrapped = [
    "<picture>",
    "  <source",
    '    media="(prefers-color-scheme: dark)"',
    '    srcset="',
    `      ${base}/rating-dark.png`,
    '    "',
    "  />",
    `  <img src="${base}/rating.png" alt="Rating" />`,
    "</picture>",
  ].join("\n");
  expect(themedFigures(wrapped)).toBe(
    `![Rating](${base}/rating.png#light-only)\n![Rating](${base}/rating-dark.png#dark-only)`,
  );
});

test("reads a media query without a space and single-quoted attributes", () => {
  const variant = [
    "<picture>",
    `  <source media='(prefers-color-scheme:dark)' srcset='${base}/rating-dark.png'>`,
    `  <img src='${base}/rating.png' alt='Rating'>`,
    "</picture>",
  ].join("\n");
  expect(themedFigures(variant)).toBe(
    `![Rating](${base}/rating.png#light-only)\n![Rating](${base}/rating-dark.png#dark-only)`,
  );
});

test.each([
  ["no <img src>", `<picture><img alt="x"></picture>`],
  [
    "not (prefers-color-scheme:dark)",
    `<picture><source media="(min-width: 600px)" srcset="${base}/a.png"><img src="${base}/rating.png"></picture>`,
  ],
  [
    "no <source srcset>",
    `<picture><source media="(prefers-color-scheme: dark)"><img src="${base}/rating.png"></picture>`,
  ],
  [
    "more than one <source>",
    `<picture><source media="(prefers-color-scheme: dark)" srcset="${base}/a.png"><source media="(prefers-color-scheme: dark)" srcset="${base}/b.png"><img src="${base}/rating.png"></picture>`,
  ],
])("throws on a block it cannot read: %s", (reason, block) => {
  expect(() => themedFigures(block)).toThrow(reason);
});

test("keeps a figure without a dark capture visible in both themes", () => {
  expect(
    themedFigures(`<picture><img src="${base}/rating.png" alt="x"></picture>`),
  ).toBe(`![x](${base}/rating.png)`);
});

test("escapes backslashes in the alt text", () => {
  expect(
    themedFigures(
      `<picture><img src="${base}/rating.png" alt="a\\]b"></picture>`,
    ),
  ).toBe(`![a\\\\\\]b](${base}/rating.png)`);
});

test("leaves plain markdown images alone", () => {
  const body = `![x](${base}/rating.png)\n`;
  expect(themedFigures(body)).toBe(body);
});
