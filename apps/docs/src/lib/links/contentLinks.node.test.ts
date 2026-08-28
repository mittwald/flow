import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkLinks } from "@/lib/links/checkLinks";
import { formatProblems } from "@/lib/links/formatProblems";
import { buildPageInventory, collectDocLinks } from "@/lib/links/scanDocs";

describe("the documentation's internal links", () => {
  const inventory = buildPageInventory();
  const links = collectDocLinks();

  it("scans the content and the app sources", () => {
    assert.ok(inventory.size > 100, `only ${inventory.size} pages found`);
    assert.ok(links.length > 400, `only ${links.length} links found`);
  });

  it("all resolve", () => {
    const problems = checkLinks(links, inventory);

    assert.equal(problems.length, 0, formatProblems(problems));
  });
});
