import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { renderList, stripAnsi, validateListBounds } from "../cli/list";

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
  apply: `apply ${id}`,
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

  test("shows apply, which is what an agent acts on", () => {
    expect(text).toContain("apply by-hand");
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

const hasAnsi = (text: string): boolean => stripAnsi(text) !== text;

describe("presentation", () => {
  const long = {
    ...entry("wordy", "1.0.0", "manual"),
    title: "A title with `code` in it",
    apply:
      "Rename `Align` to `Combine` and `AlignProps` to `CombineProps`, for named, aliased and namespace imports from a Flow package, everywhere it appears.",
  };

  test("plain text by default — no escape sequences", () => {
    const text = renderList({ entries: [long], json: false });
    expect(hasAnsi(text)).toBe(false);
  });

  test("colour only when asked for", () => {
    const text = renderList({ entries: [long], json: false, color: true });
    expect(hasAnsi(text)).toBe(true);
  });

  // An escape sequence inside the JSON would break every parser reading it,
  // and this is the output an agent consumes.
  test("--json never carries colour, even when colour is on", () => {
    const json = renderList({ entries: [long], json: true, color: true });
    expect(hasAnsi(json)).toBe(false);
    expect(() => JSON.parse(json) as unknown).not.toThrow();
  });

  test("prose wraps to the given width", () => {
    const width = 60;
    const lines = renderList({ entries: [long], json: false, width }).split(
      "\n",
    );
    expect(lines.every((line) => line.length <= width)).toBe(true);
  });

  test("wrapping still holds once the text is coloured", () => {
    const width = 60;
    const lines = renderList({
      entries: [long],
      json: false,
      width,
      color: true,
    })
      .split("\n")
      .map(stripAnsi);
    expect(lines.every((line) => line.length <= width)).toBe(true);
  });

  // Asserted against `apply` rather than the title: `list` no longer renders the
  // title, because next to the id it only restated it.
  test("backticks are rendered away, not printed", () => {
    const text = renderList({ entries: [long], json: false });
    expect(text).not.toContain("`");
    expect(text).toContain("Rename Align to Combine");
  });

  test("the title is not rendered — the id is the name", () => {
    const text = renderList({ entries: [long], json: false });
    expect(text).not.toContain("A title with");
    expect(text).toContain("wordy");
  });

  test("the header counts what the range holds", () => {
    const text = renderList({
      entries,
      from: "1.0.0",
      to: "2.0.0",
      json: false,
    });
    expect(text).toContain("3 migrations from 1.0.0 to 2.0.0");
    expect(text).toContain("1 codemod");
    expect(text).toContain("1 by hand");
    expect(text).toContain("1 no code change");
  });
});
