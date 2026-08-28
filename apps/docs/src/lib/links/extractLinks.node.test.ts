import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractMdxLinks, extractSourceLinks } from "@/lib/links/extractLinks";

const hrefsOf = (source: string) =>
  extractMdxLinks(source, "test.mdx").map((link) => link.href);

describe("extractMdxLinks", () => {
  it("finds a markdown link", () => {
    assert.deepEqual(
      hrefsOf("Siehe [Button](/04-components/actions/button)."),
      ["/04-components/actions/button"],
    );
  });

  it("finds a markdown link with a title", () => {
    assert.deepEqual(hrefsOf('[Button](/actions/button "Der Button")'), [
      "/actions/button",
    ]);
  });

  it("finds several links on one line", () => {
    assert.deepEqual(hrefsOf("[a](/a) und [b](/b)"), ["/a", "/b"]);
  });

  it("finds a JSX href", () => {
    assert.deepEqual(
      hrefsOf('<Link href="/02-foundations/themes">Themes</Link>'),
      ["/02-foundations/themes"],
    );
  });

  it("reports the line a link was found on", () => {
    const [link] = extractMdxLinks("erste\n\n[a](/a)", "test.mdx");

    assert.equal(link?.line, 3);
  });

  it("skips links inside a fenced code block", () => {
    assert.deepEqual(
      hrefsOf('Text\n\n```tsx\n<Link href="/nirgendwo" />\n```\n\n[a](/a)'),
      ["/a"],
    );
  });

  it("skips links inside inline code", () => {
    assert.deepEqual(hrefsOf("`[a](/nirgendwo)` aber [b](/b)"), ["/b"]);
  });

  it("finds links in frontmatter", () => {
    assert.deepEqual(
      hrefsOf("---\ndeprecationNotice: Nutze [Alert](/status/alert).\n---\n"),
      ["/status/alert"],
    );
  });

  it("passes the page through to every link", () => {
    const [link] = extractMdxLinks("[a](/a)", "test.mdx", "/my/page");

    assert.equal(link?.page, "/my/page");
  });
});

describe("extractSourceLinks", () => {
  const hrefsOf = (source: string) =>
    extractSourceLinks(source, "test.tsx").map((link) => link.href);

  it("finds a JSX href", () => {
    assert.deepEqual(hrefsOf('<Link href="/releases">Releases</Link>'), [
      "/releases",
    ]);
  });

  it("ignores markdown link syntax", () => {
    // A `](…)` in a TS source is regex or string content, not navigation.
    assert.deepEqual(hrefsOf('code.replace(/\\]\\(([^)]+)\\)/g, "[$1]")'), []);
  });
});
