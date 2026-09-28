import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { getAllDocPages } from "./docPages";
import { generateLlmsTxt } from "./generateLlmsTxt";
import { SITE_URL, rawMarkdownPath } from "./siteUrls";

const llmsTxt = generateLlmsTxt();
const pages = getAllDocPages();
const markdownUrls = new Set(
  pages.map((page) => `${SITE_URL}${rawMarkdownPath(page.segments)}`),
);

const linksIn = (markdown: string): string[] =>
  [...markdown.matchAll(/\]\((\S+?)\)/g)].map((match) => match[1] ?? "");

test("every page is listed", () => {
  const listed = new Set(linksIn(llmsTxt));
  const missing = [...markdownUrls].filter((url) => !listed.has(url));

  expect(missing).toEqual([]);
});

test("every page link points to an existing Markdown page", () => {
  const optional = [`${SITE_URL}/llms-full.txt`, `${SITE_URL}/llms.json`];
  const dead = linksIn(llmsTxt).filter(
    (url) => !markdownUrls.has(url) && !optional.includes(url),
  );

  expect(dead).toEqual([]);
});

test("the full export is only offered as optional", () => {
  const optionalSection = llmsTxt.indexOf("\n## Optional\n");

  expect(optionalSection).toBeGreaterThan(-1);
  expect(llmsTxt.indexOf("llms-full.txt")).toBeGreaterThan(optionalSection);
});

test("the extension guidance names the remote package", () => {
  expect(llmsTxt).toContain("**Building an mStudio extension**");
  expect(llmsTxt).toContain(
    "Import from `@mittwald/flow-remote-react-components`",
  );
  expect(llmsTxt).toMatch(/Not available remotely: .*`Overlay`/);
});

/*
 * The packages' USAGE.md files send agents to `/raw/<path>.md` pages. Nothing
 * else notices when such a page moves — the docs link check covers the docs
 * sources only.
 */
test.each([
  "packages/components/USAGE.md",
  "packages/remote-react-components/USAGE.md",
])("every docs page %s links to exists", (usageFile) => {
  const content = fs.readFileSync(
    path.resolve(import.meta.dirname, "../../../../..", usageFile),
    "utf-8",
  );
  const keys = new Set(pages.map((page) => page.segments.join("/")));
  const referenced = [...content.matchAll(/\/raw\/([\w/-]+)\.md/g)].map(
    (match) => match[1] ?? "",
  );

  expect(referenced.length).toBeGreaterThan(0);
  expect(referenced.filter((key) => !keys.has(key))).toEqual([]);
});
