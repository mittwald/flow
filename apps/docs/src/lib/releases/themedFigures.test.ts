import { expect, test, vi } from "vitest";
import { themedFigures as themedFiguresWith } from "./themedFigures";

const themedFigures = (body: string) =>
  themedFiguresWith(body, (reason) => {
    throw new Error(`unexpected warning: ${reason}`);
  });

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

test("ignores a light <source> next to the dark one", () => {
  const block = `<picture><source media="(prefers-color-scheme: light)" srcset="${base}/rating.png"><source media="(prefers-color-scheme: dark)" srcset="${base}/rating-dark.png"><img src="${base}/rating.png" alt="Rating"></picture>`;
  expect(themedFigures(block)).toBe(
    `![Rating](${base}/rating.png#light-only)\n![Rating](${base}/rating-dark.png#dark-only)`,
  );
});

test.each([
  ["no <img src>", `<picture><img alt="x"></picture>`],
  [
    "media other than",
    `<picture><source media="(min-width: 600px)" srcset="${base}/a.png"><img src="${base}/rating.png"></picture>`,
  ],
  [
    "no <source srcset>",
    `<picture><source media="(prefers-color-scheme: dark)"><img src="${base}/rating.png"></picture>`,
  ],
  [
    "more than one",
    `<picture><source media="(prefers-color-scheme: dark)" srcset="${base}/a.png"><source media="(prefers-color-scheme: dark)" srcset="${base}/b.png"><img src="${base}/rating.png"></picture>`,
  ],
])(
  "reports a block it cannot read and shows it as code: %s",
  (reason, block) => {
    const onUnreadable = vi.fn();
    expect(themedFiguresWith(`before\n\n${block}\n\nafter`, onUnreadable)).toBe(
      `before\n\n\`\`\`html\n${block}\n\`\`\`\n\nafter`,
    );
    expect(onUnreadable).toHaveBeenCalledOnce();
    expect(onUnreadable.mock.calls[0]?.[0]).toContain(reason);
  },
);

test("leaves a <picture> inside a fenced code block alone", () => {
  const body = [
    "```html",
    `<picture><img alt="no src"></picture>`,
    "```",
    "",
    "~~~~",
    `<picture><img src="${base}/rating.png" alt="x"></picture>`,
    "~~~~",
    "",
    `<picture><img src="${base}/rating.png" alt="x"></picture>`,
  ].join("\n");
  expect(themedFigures(body)).toBe(
    body.replace(
      /<picture><img src="[^"]*" alt="x"><\/picture>$/,
      `![x](${base}/rating.png)`,
    ),
  );
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
