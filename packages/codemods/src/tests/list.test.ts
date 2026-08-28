import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { parseArguments } from "../cli/args";
import { renderList, runList, stripAnsi, type ListDeps } from "../cli/list";

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
  const text = renderList({
    entries,
    range: { from: "1.0.0", to: "2.0.0" },
    json: false,
  });

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
    // `since: "4.0.0"` on every entry, ahead of the range's own `to` — a
    // codemod's lower bound is gone (selectEntries), so a range merely
    // behind `current` no longer proves emptiness; only "not yet published
    // by `target`" still does, for every action alike.
    const future = [
      entry("future-codemod", "4.0.0", "codemod"),
      entry("future-manual", "4.0.0", "manual"),
    ];
    expect(
      renderList({
        entries: future,
        range: { from: "3.0.0", to: "3.1.0" },
        json: false,
      }),
    ).toContain("Nothing to migrate");
  });
});

describe("renderList as JSON", () => {
  test("emits the selected entries as a parseable array", () => {
    const parsed = JSON.parse(
      renderList({
        entries,
        range: { from: "1.0.0", to: "2.0.0" },
        json: true,
      }),
    ) as CatalogEntry[];

    expect(parsed.map((selected) => selected.id)).toEqual([
      "with-codemod",
      "by-hand",
      "behaviour-only",
    ]);
    expect(parsed[0]).toMatchObject({ apply: "apply with-codemod" });
  });

  test("an empty range is an empty array, not a message", () => {
    // Same reasoning as the text-output test above: `since` ahead of `to` is
    // what proves emptiness now, not merely behind `from`.
    const future = [
      entry("future-codemod", "4.0.0", "codemod"),
      entry("future-manual", "4.0.0", "manual"),
    ];
    expect(
      renderList({
        entries: future,
        range: { from: "3.0.0", to: "3.1.0" },
        json: true,
      }),
    ).toBe("[]");
  });
});

describe("renderList without a range", () => {
  test("no range lists the whole catalogue", () => {
    const parsed = JSON.parse(
      renderList({ entries, json: true }),
    ) as CatalogEntry[];
    expect(parsed).toHaveLength(3);
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
      range: { from: "1.0.0", to: "2.0.0" },
      json: false,
    });
    expect(text).toContain("3 migrations from 1.0.0 to 2.0.0");
    expect(text).toContain("1 codemod");
    expect(text).toContain("1 by hand");
    expect(text).toContain("1 no code change");
  });
});

describe("catch-up codemods", () => {
  // A codemod's lower bound is gone (selectEntries), so a range-bounded list
  // can show a codemod that shipped before `current` — re-running it is a
  // no-op, not new work, and the rendering has to say so rather than reading
  // like a to-do list.
  const catalog = [
    entry("shipped-earlier", "0.9.0", "codemod"),
    entry("new-in-range", "1.1.0", "codemod"),
    entry("old-manual", "0.9.0", "manual"),
  ];

  test("a codemod behind current is marked catch-up in the entry, a new one is not", () => {
    const text = renderList({
      entries: catalog,
      range: { from: "1.0.0", to: "2.0.0" },
      json: false,
    });
    const [shippedBlock, newBlock] = text.split("new-in-range");
    expect(shippedBlock).toContain("shipped-earlier");
    expect(shippedBlock).toContain("catch-up");
    // "new-in-range" itself is not behind current, so its own block must not
    // carry the catch-up tag.
    expect(newBlock).not.toContain("catch-up");
  });

  test("the header explains what the catch-up mark means and why it's safe", () => {
    const text = renderList({
      entries: catalog,
      range: { from: "1.0.0", to: "2.0.0" },
      json: false,
    });
    // The legend names the mark and the reassurance ("safe no-op"); the exact
    // count is already in the counts line above it, so the legend itself
    // doesn't repeat it.
    expect(text).toMatch(/catch-up/);
    expect(text).toMatch(/safe no-op/);
    expect(text).toContain("2 codemods");
  });

  test("no legend when nothing in range is catch-up", () => {
    const text = renderList({
      entries: [entry("new-in-range", "1.1.0", "codemod")],
      range: { from: "1.0.0", to: "2.0.0" },
      json: false,
    });
    expect(text).not.toContain("catch-up");
  });

  test("names how many manual migrations the window hides, without listing them", () => {
    const text = renderList({
      entries: catalog,
      range: { from: "1.0.0", to: "2.0.0" },
      json: false,
    });
    // "old-manual" (since 0.9.0 <= current 1.0.0) is excluded by design and
    // must be counted, not shown.
    expect(text).not.toContain("old-manual");
    expect(text).toMatch(/1 manual migration.*not shown/);
  });

  test("the whole-catalogue browse (no range) has no catch-up marking at all", () => {
    const text = renderList({ entries: catalog, json: false });
    expect(text).not.toContain("catch-up");
  });

  test("JSON stays the plain selected array — no catch-up field grafted on", () => {
    const json = renderList({
      entries: catalog,
      range: { from: "1.0.0", to: "2.0.0" },
      json: true,
    });
    const parsed = JSON.parse(json) as CatalogEntry[];
    expect(parsed.map((e) => e.id).sort()).toEqual([
      "new-in-range",
      "shipped-earlier",
    ]);
  });
});

// `runList` is the CLI-level entry point: it decides between the two forms
// (whole catalogue vs. a revision's range) and, for the latter, drives
// `resolveRange` — the same module `upgrade` uses to answer "what range am I
// looking at".
const registry = {
  versions: ["0.2.0-alpha.646", "1.0.0", "1.0.1", "1.0.5", "1.1.0", "1.2.0"],
  distTags: { latest: "1.2.0" },
};

const project = (dependencies: Record<string, string>): string => {
  const dir = mkdtempSync(join(tmpdir(), "flow-list-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies }, null, 2),
  );
  return dir;
};

const deps = (
  cwd: string,
  overrides: Partial<ListDeps> = {},
): ListDeps & {
  written: string[];
} => {
  const written: string[] = [];
  return {
    cwd,
    fetchVersions: async () => registry,
    readInstalledVersion: () => undefined,
    write: (text) => written.push(text),
    written,
    ...overrides,
  };
};

describe("runList", () => {
  test("no revision lists the whole catalogue, offline — no manifest is read", async () => {
    // A directory with nothing in it at all, not even a package.json: if this
    // needed one, `fetchVersions` throwing below would prove it — a bare
    // `list` never even gets there.
    const cwd = mkdtempSync(join(tmpdir(), "flow-list-empty-"));
    const recorded = deps(cwd, {
      fetchVersions: () => {
        throw new Error("must not be called for a bare `list`");
      },
    });

    const code = await runList(parseArguments(["list"]), recorded);

    expect(code).toBe(0);
    expect(recorded.written.join("")).toContain("migrations");
  });

  test("--json with no revision is the whole catalogue as a parseable array", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-list-empty-json-"));
    const recorded = deps(cwd, {
      fetchVersions: () => {
        throw new Error("must not be called for a bare `list`");
      },
    });

    const code = await runList(parseArguments(["list", "--json"]), recorded);

    expect(code).toBe(0);
    expect(() => JSON.parse(recorded.written.join(""))).not.toThrow();
  });

  test("a revision resolves the same range `upgrade` would act on", async () => {
    const cwd = project({
      "@mittwald/flow-react-components": "^1.0.1",
    });
    const recorded = deps(cwd);

    const code = await runList(parseArguments(["list", "minor"]), recorded);

    expect(code).toBe(0);
    expect(recorded.written.join("")).toContain("from 1.0.1 to 1.2.0");
  });

  test("a directory with no package.json prints the clear message, not ENOENT", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "flow-list-nomanifest-"));
    const recorded = deps(cwd);

    const code = await runList(parseArguments(["list", "minor"]), recorded);

    expect(code).toBe(1);
    const output = recorded.written.join("");
    expect(output).not.toContain("ENOENT");
    expect(output).toContain("No package.json found");
  });

  test("a revision that resolves at or below current prints, it does not refuse", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.2.0" });
    const recorded = deps(cwd);

    const code = await runList(parseArguments(["list", "latest"]), recorded);

    // `upgrade` would refuse here ("Already on ... Nothing to do") because
    // there is nothing to write. `list` has nothing to write in the first
    // place, so it just shows the (here: empty-of-migrations) range — the
    // catalogue can still carry a `deprecation` entry whose replacement
    // already exists at that version, which is real information, not a
    // refusal to word differently.
    const output = recorded.written.join("");
    expect(code).toBe(0);
    // Zero-width — `from`/`to` would be the wrong form here, since there is
    // no range at all.
    expect(output).toContain("nothing newer than 1.2.0");
    expect(output).not.toContain("from 1.2.0 to 1.2.0");
    expect(output).not.toMatch(/already on|nothing to do/i);
  });

  test("an unresolvable revision names what it could not resolve", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const recorded = deps(cwd);

    const code = await runList(parseArguments(["list", "nonsense"]), recorded);

    expect(code).toBe(1);
    expect(recorded.written.join("")).toContain("nonsense");
  });

  test("--json is honoured for a revision-bounded range too", async () => {
    const cwd = project({ "@mittwald/flow-react-components": "^1.0.1" });
    const recorded = deps(cwd);

    await runList(parseArguments(["list", "minor", "--json"]), recorded);

    expect(() => JSON.parse(recorded.written.join(""))).not.toThrow();
  });
});
