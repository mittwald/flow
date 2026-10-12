import { expect, test } from "vitest";
import { getAllDocPages } from "./docPages";
import { generateLlmsJson } from "./generateLlmsJson";
import { SITE_URL, rawMarkdownPath } from "./siteUrls";

const llmsJson = generateLlmsJson();

test("the instructions come before the page list", () => {
  const keys = Object.keys(llmsJson);

  expect(keys.indexOf("instructions")).toBeLessThan(keys.indexOf("pages"));
  expect(llmsJson.instructions.templates).toContain(
    "Building a new app, page or flow: pick the matching template",
  );
});

test("every app shell link points to an existing page", () => {
  const markdownUrls = getAllDocPages().map(
    (page) => `${SITE_URL}${rawMarkdownPath(page.segments)}`,
  );

  expect(llmsJson.instructions.appShells).toHaveLength(3);
  for (const url of llmsJson.instructions.appShells) {
    expect(markdownUrls).toContain(url);
  }
});
