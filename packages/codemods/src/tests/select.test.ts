import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { selectEntries, sortBySince } from "../catalog/select";

const entry = (
  id: string,
  since: string,
  kind: CatalogEntry["kind"] = "migration",
): CatalogEntry => ({
  id,
  since,
  title: id,
  kind,
  action: "codemod",
  remotePackage: false,
  detect: "rg x",
  apply: "do it",
  verify: "tsc --noEmit",
});

const ids = (entries: CatalogEntry[]): string[] =>
  entries.map((selected) => selected.id);

describe("selectEntries", () => {
  test("a migration is selected only when the range crosses it", () => {
    const catalog = [entry("crossed", "0.2.0-alpha.646")];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.640", "1.0.1"))).toEqual([
      "crossed",
    ]);
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("since equal to target is crossed, since equal to current is not", () => {
    const catalog = [entry("edge", "1.1.0")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
    expect(ids(selectEntries(catalog, "1.1.0", "1.2.0"))).toEqual([]);
  });

  test("a deprecation is selected whenever the replacement exists", () => {
    const catalog = [entry("dep", "0.2.0-alpha.1056", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["dep"]);
    expect(ids(selectEntries(catalog, "0.2.0-alpha.900", "1.0.0"))).toEqual([
      "dep",
    ]);
  });

  test("a deprecation whose replacement is not in the target yet is skipped", () => {
    const catalog = [entry("future", "2.0.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("a tool is never selected", () => {
    const catalog = [entry("port", "0.2.0", "tool")];
    expect(ids(selectEntries(catalog, "0.1.0", "9.9.9"))).toEqual([]);
  });

  test("alpha prereleases compare numerically, not as strings", () => {
    // The bounds straddle a single-to-double-digit boundary on purpose: numeric
    // comparison includes `.10` (9 < 10 <= 11), a string comparison excludes it
    // (`"9" < "10"` is false). Bounds like .700-.800 around .712/.1046 pass under
    // both a correct and a naive string implementation, so they prove nothing.
    const catalog = [entry("included", "0.2.0-alpha.10")];
    expect(
      ids(selectEntries(catalog, "0.2.0-alpha.9", "0.2.0-alpha.11")),
    ).toEqual(["included"]);
  });

  test("a deprecation whose since equals the target is selected", () => {
    const catalog = [entry("edge", "1.1.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
  });

  test("the next line is crossed like any other range", () => {
    const catalog = [entry("n", "1.1.0-next.5")];
    expect(ids(selectEntries(catalog, "1.1.0-next.3", "1.1.0-next.7"))).toEqual(
      ["n"],
    );
  });

  test("results are ordered oldest first, the order the changes shipped", () => {
    const catalog = [
      entry("late", "0.2.0-alpha.1047"),
      entry("early", "0.2.0-alpha.646"),
      entry("middle", "0.2.0-alpha.712"),
    ];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.600", "1.0.0"))).toEqual([
      "early",
      "middle",
      "late",
    ]);
  });
});

describe("sortBySince", () => {
  test("sorts oldest first and does not mutate its input", () => {
    const catalog = [entry("b", "1.1.0"), entry("a", "1.0.0")];
    expect(ids(sortBySince(catalog))).toEqual(["a", "b"]);
    expect(ids(catalog)).toEqual(["b", "a"]);
  });
});
