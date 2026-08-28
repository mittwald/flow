import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";

const catalog = readCatalog();
const byId = new Map(catalog.map((entry) => [entry.id, entry]));

const hasTransform = (id: string): boolean =>
  existsSync(fileURLToPath(new URL(`../transforms/${id}.ts`, import.meta.url)));

describe("the catalogue reads and validates", () => {
  test("it is not empty", () => {
    expect(catalog.length).toBeGreaterThan(0);
  });

  test("an entry with a codemod carries its structured fields", () => {
    expect(byId.get("align-to-combine")).toMatchObject({
      id: "align-to-combine",
      since: "0.2.0-alpha.1047",
      kind: "migration",
      action: "codemod",
      remotePackage: true,
    });
  });

  test("an entry without a codemod is marked manual", () => {
    expect(byId.get("renamed-css-export")).toMatchObject({ action: "manual" });
  });

  test("the body is Markdown, not frontmatter", () => {
    const entry = byId.get("align-to-combine");
    expect(entry?.body).not.toMatch(/^---/);
    expect(entry?.body.length).toBeGreaterThan(0);
  });
});

describe("catalogue invariants", () => {
  test("every id is dashed and lowercase", () => {
    const bad = catalog
      .map((entry) => entry.id)
      .filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id));
    expect(bad).toEqual([]);
  });

  test("every id is unique", () => {
    const ids = catalog.map((entry) => entry.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  test("action codemod means a transform exists, and a transform means codemod", () => {
    const mismatched = catalog.filter(
      (entry) => hasTransform(entry.id) !== (entry.action === "codemod"),
    );
    expect(mismatched.map((entry) => entry.id)).toEqual([]);
  });

  test("kind and action only take known values", () => {
    const kinds = new Set(["migration", "deprecation"]);
    const actions = new Set(["codemod", "manual", "none"]);
    const bad = catalog.filter(
      (entry) => !kinds.has(entry.kind) || !actions.has(entry.action),
    );
    expect(bad.map((entry) => entry.id)).toEqual([]);
  });
});
