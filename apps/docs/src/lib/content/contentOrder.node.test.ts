import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as path from "path";
import jetpack from "fs-jetpack";
import { CONTENT_ORDER } from "@/lib/content/contentOrder";

const contentDir = "src/content";

/**
 * Every page directory and every directory on the way to one, as pathnames.
 * `examples/` holds code samples, not pages, and never shows up here because it
 * has no `index.mdx`.
 */
const pageDirectories = (): Set<string> => {
  const directories = new Set<string>(["/"]);

  for (const file of jetpack.find(contentDir, { matching: "**/index.mdx" })) {
    const segments = path.dirname(path.relative(contentDir, file)).split("/");
    for (let i = 1; i <= segments.length; i++) {
      directories.add(`/${segments.slice(0, i).join("/")}`);
    }
  }

  return directories;
};

const parentOf = (pathname: string): string =>
  pathname.slice(0, pathname.lastIndexOf("/")) || "/";

const childrenOf = (parent: string, all: Set<string>): string[] =>
  [...all].filter(
    (pathname) => pathname !== "/" && parentOf(pathname) === parent,
  );

describe("CONTENT_ORDER", () => {
  it("lists only pages that exist", () => {
    const existing = pageDirectories();
    const stale = CONTENT_ORDER.filter((pathname) => !existing.has(pathname));

    assert.deepEqual(
      stale,
      [],
      "listed but not in src/content — a rename left them behind",
    );
  });

  it("orders a directory's children completely or not at all", () => {
    const existing = pageDirectories();
    const listed = new Set(CONTENT_ORDER);

    // A partly listed directory is the silent failure this guards: the listed
    // children sort by their position, the forgotten ones fall back to their
    // label, and the result is half authored and half alphabetical.
    const partial = [...existing]
      .map((parent) => ({
        parent,
        missing: childrenOf(parent, existing).filter(
          (child) => !listed.has(child),
        ),
        present: childrenOf(parent, existing).filter((child) =>
          listed.has(child),
        ),
      }))
      .filter((d) => d.present.length > 0 && d.missing.length > 0)
      .map((d) => `${d.parent}: missing ${d.missing.join(", ")}`);

    assert.deepEqual(partial, []);
  });
});
