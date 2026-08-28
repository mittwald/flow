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
    expect(
      renderList({
        entries,
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
    expect(
      renderList({
        entries,
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
    expect(output).toContain("from 1.2.0 to 1.2.0");
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
