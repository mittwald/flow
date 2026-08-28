import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractAnchors } from "@/lib/mdx/anchors";

describe("extractAnchors", () => {
  it("slugifies an h1", () => {
    assert.deepEqual(extractAnchors("# Light und Dark"), [
      { slug: "light-und-dark", text: "Light und Dark", level: 2 },
    ]);
  });

  it("nests an h2 under the preceding h1", () => {
    const [, h2] = extractAnchors("# Farben\n\n## Light und Dark Color");

    assert.deepEqual(h2, {
      slug: "farben-light-und-dark-color",
      text: "Light und Dark Color",
      level: 3,
    });
  });

  it("drops dots from an h1 before slugifying", () => {
    const [h1] = extractAnchors("# Version 1.0 Notes");

    assert.equal(h1?.slug, "version-10-notes");
  });

  it("keeps an h2 without a preceding h1 standalone", () => {
    const [h2] = extractAnchors("## Ohne Überschrift");

    assert.equal(h2?.slug, "ohne-uberschrift");
  });

  it("ignores deeper headings and prose", () => {
    assert.deepEqual(
      extractAnchors("### Zu tief\n\nEin Satz mit # in der Mitte").length,
      0,
    );
  });
});
