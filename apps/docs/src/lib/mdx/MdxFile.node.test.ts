import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MdxFile } from "@/lib/mdx/MdxFile";

describe("MdxFile.titleFrom", () => {
  it("prefers the frontmatter title", () => {
    assert.equal(
      MdxFile.titleFrom({ title: "Multi Upload", component: "FileField" }, [
        "03-patterns",
        "multi-upload",
      ]),
      "Multi Upload",
    );
  });

  it("falls back to the component name", () => {
    assert.equal(
      MdxFile.titleFrom({ component: "Button" }, ["actions", "button"]),
      "Button",
    );
  });

  it("falls back to the humanized last slug", () => {
    assert.equal(
      MdxFile.titleFrom({}, ["01-get-started", "installation"]),
      "Installation",
    );
  });

  it("returns an empty title for empty slugs", () => {
    assert.equal(MdxFile.titleFrom({}, []), "");
  });
});
