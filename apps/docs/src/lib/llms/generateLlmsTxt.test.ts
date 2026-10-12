import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { getAllDocPages } from "./docPages";
import { generateLlmsTxt } from "./generateLlmsTxt";
import { SITE_URL, rawMarkdownPath } from "./siteUrls";
import { TEMPLATE_RULE_LEAD } from "./templateRule";

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

test("the header asks for a template first", () => {
  const header = llmsTxt.slice(0, llmsTxt.indexOf("\n## "));

  expect(header).toContain("pick the matching template");
  expect(header).toContain("/raw/templates/app-shells/simple-app.md");
  expect(llmsTxt).toContain("\n## Templates\n");
});

/*
 * Agents enter through different files, so each one carries the template rule
 * itself (#3313). The package component index has its own test in
 * `packages/components/dev/component-index/docsMeta.test.ts`.
 */
test.each([
  "packages/components/README.md",
  "packages/components/USAGE.md",
  "packages/remote-react-components/USAGE.md",
])("%s carries the template rule", (file) => {
  const content = fs.readFileSync(
    path.resolve(import.meta.dirname, "../../../../..", file),
    "utf-8",
  );

  expect(content).toContain(
    `${TEMPLATE_RULE_LEAD}: pick the matching template`,
  );
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
