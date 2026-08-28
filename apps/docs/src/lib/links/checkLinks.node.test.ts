import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PageInventory } from "@/lib/links/checkLinks";
import { checkLinks } from "@/lib/links/checkLinks";
import type { FoundLink } from "@/lib/links/extractLinks";

const inventory: PageInventory = new Map([
  ["/04-components/form-controls/rating", new Set<string>()],
  ["/04-components/react-hook-form/form", new Set<string>()],
  ["/02-foundations/01-design/02-colors", new Set(["farben-light-und-dark"])],
  ["/", new Set<string>()],
]);

const link = (href: string, page?: string): FoundLink => ({
  href,
  file: "test.mdx",
  line: 1,
  page,
});

const check = (href: string, page?: string) =>
  checkLinks([link(href, page)], inventory);

describe("checkLinks", () => {
  it("accepts a link to an existing page", () => {
    assert.deepEqual(check("/04-components/form-controls/rating"), []);
  });

  it("accepts a trailing slash and a query string", () => {
    assert.deepEqual(check("/04-components/form-controls/rating/"), []);
    assert.deepEqual(check("/04-components/form-controls/rating?tab=x"), []);
  });

  it("ignores external targets", () => {
    for (const href of [
      "https://example.com/nirgendwo",
      "http://example.com",
      "mailto:hallo@mittwald.de",
    ]) {
      assert.deepEqual(check(href), []);
    }
  });

  it("reports an unknown page", () => {
    const [problem] = check("/04-components/content/nirgendwo");

    assert.equal(problem?.reason, "unknown-page");
  });

  it("suggests the page that kept its name when a page moved", () => {
    const [problem] = check("/04-components/content/rating");

    assert.deepEqual(problem?.suggestions, [
      "/04-components/form-controls/rating",
    ]);
  });

  it("suggests a renamed page by token overlap", () => {
    const [problem] = check(
      "/04-components/form-controls/form-react-hook-form",
    );

    assert.equal(
      problem?.suggestions[0],
      "/04-components/react-hook-form/form",
    );
  });

  it("reports a link without a leading slash", () => {
    const [problem] = check("04-components/form-controls/rating");

    assert.equal(problem?.reason, "relative-link");
  });

  it("accepts a known anchor on another page", () => {
    assert.deepEqual(
      check("/02-foundations/01-design/02-colors#farben-light-und-dark"),
      [],
    );
  });

  it("reports an unknown anchor and lists what the page offers", () => {
    const [problem] = check(
      "/02-foundations/01-design/02-colors#gibt-es-nicht",
    );

    assert.equal(problem?.reason, "unknown-anchor");
    assert.deepEqual(problem?.availableAnchors, ["farben-light-und-dark"]);
  });

  it("resolves a bare fragment against the page it sits on", () => {
    assert.deepEqual(
      check("#farben-light-und-dark", "/02-foundations/01-design/02-colors"),
      [],
    );
    assert.equal(
      check("#gibt-es-nicht", "/02-foundations/01-design/02-colors")[0]?.reason,
      "unknown-anchor",
    );
  });

  it("ignores a placeholder href and a fragment outside a page", () => {
    assert.deepEqual(check("#"), []);
    assert.deepEqual(check("#irgendwas"), []);
  });

  it("collects problems from every link", () => {
    const problems = checkLinks(
      [link("/gibt-es-nicht"), link("auch-nicht"), link("/")],
      inventory,
    );

    assert.deepEqual(
      problems.map((problem) => problem.reason),
      ["unknown-page", "relative-link"],
    );
  });
});
