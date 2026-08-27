import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { renderList, validateListBounds } from "../cli/list";

const entry = (
  id: string,
  since: string,
  action: CatalogEntry["action"],
): CatalogEntry => ({
  id,
  since,
  title: id,
  kind: "migration",
  action,
  remotePackage: false,
  detect: action === "none" ? undefined : `rg ${id}`,
  apply: `apply ${id}`,
  verify: `verify ${id}`,
});

const entries = [
  entry("with-codemod", "1.1.0", "codemod"),
  entry("by-hand", "1.2.0", "manual"),
  entry("behaviour-only", "1.3.0", "none"),
];

describe("renderList as text", () => {
  const text = renderList({ entries, from: "1.0.0", to: "2.0.0", json: false });

  test("names every entry with its version and what it needs", () => {
    expect(text).toContain("with-codemod");
    expect(text).toContain("1.1.0");
    expect(text).toContain("by-hand");
    expect(text).toContain("behaviour-only");
  });

  test("shows the ready-made invocation for a codemod", () => {
    expect(text).toContain("flow-codemods@latest with-codemod");
  });

  test("shows apply and verify, which is what an agent acts on", () => {
    expect(text).toContain("apply by-hand");
    expect(text).toContain("verify by-hand");
  });

  test("says so when the range holds nothing", () => {
    expect(
      renderList({ entries, from: "3.0.0", to: "3.1.0", json: false }),
    ).toContain("Nothing to migrate");
  });
});

describe("renderList as JSON", () => {
  test("emits the selected entries as a parseable array", () => {
    const parsed = JSON.parse(
      renderList({ entries, from: "1.0.0", to: "2.0.0", json: true }),
    ) as CatalogEntry[];

    expect(parsed.map((selected) => selected.id)).toEqual([
      "with-codemod",
      "by-hand",
      "behaviour-only",
    ]);
    expect(parsed[0]).toMatchObject({ apply: "apply with-codemod" });
  });

  test("an empty range is an empty array, not a message", () => {
    expect(
      renderList({ entries, from: "3.0.0", to: "3.1.0", json: true }),
    ).toBe("[]");
  });
});

describe("renderList without bounds", () => {
  test("no bounds lists the whole catalogue", () => {
    const parsed = JSON.parse(
      renderList({ entries, json: true }),
    ) as CatalogEntry[];
    expect(parsed).toHaveLength(3);
  });
});

// The subtlest behaviour here, and the one a later reader is most likely to
// "simplify" away.
describe("tools are browsable but never required", () => {
  const withTool = [
    ...entries,
    { ...entry("port-it", "1.0.0", "codemod"), kind: "tool" as const },
  ];

  test("an unbounded list includes a tool", () => {
    const parsed = JSON.parse(
      renderList({ entries: withTool, json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).toContain("port-it");
  });

  test("a bounded list never includes a tool", () => {
    const parsed = JSON.parse(
      renderList({ entries: withTool, from: "0.9.0", to: "2.0.0", json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).not.toContain("port-it");
  });

  test("a lower bound of none still reaches the oldest entry", () => {
    const oldest = [entry("ancient", "0.0.0", "manual")];
    const parsed = JSON.parse(
      renderList({ entries: oldest, to: "1.0.0", json: true }),
    ) as CatalogEntry[];
    expect(parsed.map((e) => e.id)).toEqual(["ancient"]);
  });
});

describe("validateListBounds", () => {
  test("valid bounds, or none at all, need no message", () => {
    expect(validateListBounds({})).toBeUndefined();
    expect(validateListBounds({ from: "1.0.0" })).toBeUndefined();
    expect(validateListBounds({ from: "1.0.0", to: "2.0.0" })).toBeUndefined();
  });

  // The original bug: an invalid bound reached semver's `lt`/`lte` inside
  // `selectEntries` and threw node-semver's own "Invalid Version: 1.0" — this
  // check exists to catch it first, before that throw, with a message that
  // names the flag and what is accepted.
  test("an incomplete version like 1.0 is rejected, not passed to semver", () => {
    const message = validateListBounds({ from: "1.0" });
    expect(message).toContain('"1.0"');
    expect(message).not.toMatch(/invalid version/i);
  });

  test("a range is rejected — only an exact version is accepted", () => {
    expect(validateListBounds({ from: "^1.0.0" })).toContain('"^1.0.0"');
  });

  test("a dist-tag is rejected — list has no registry to resolve it against", () => {
    expect(validateListBounds({ to: "latest" })).toContain('"latest"');
  });

  test("both bounds invalid are both named", () => {
    const message = validateListBounds({ from: "1.0", to: "latest" });
    expect(message).toContain('"1.0"');
    expect(message).toContain('"latest"');
  });
});
