import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { selectEntries, sortBySince } from "../catalog/select";

const entry = (
  id: string,
  since: string,
  kind: CatalogEntry["kind"] = "migration",
  action: CatalogEntry["action"] = "manual",
): CatalogEntry => ({
  id,
  since,
  title: id,
  kind,
  action,
  remotePackage: false,
  apply: "do it",
});

const ids = (entries: CatalogEntry[]): string[] =>
  entries.map((selected) => selected.id);

describe("selectEntries", () => {
  test("a manual migration is selected once its since is at or before target — current does not gate it", () => {
    // The lower bound (current < since) is gone: nothing records which
    // migrations a project has performed, so "behind current" was a guess,
    // not a fact. Dropping it for codemods (idempotent) but keeping it for
    // manual entries was inconsistent, and it hid exactly what a consumer who
    // never ran this tool needed to see. See `selectEntries`'s own comment.
    const catalog = [entry("behind", "0.2.0-alpha.646", "migration", "manual")];
    expect(ids(selectEntries(catalog, "1.0.1"))).toEqual(["behind"]);
  });

  test("a codemod entry behind target is selected — re-running it is a no-op", () => {
    const catalog = [
      entry("already-shipped", "0.2.0-alpha.646", "migration", "codemod"),
    ];
    expect(ids(selectEntries(catalog, "1.1.0"))).toEqual(["already-shipped"]);
  });

  test("an entry is excluded once it is ahead of target", () => {
    const catalog = [
      entry("not-yet-codemod", "2.0.0", "migration", "codemod"),
      entry("not-yet-manual", "2.0.0", "migration", "manual"),
      entry("not-yet-deprecation", "2.0.0", "deprecation"),
    ];
    expect(ids(selectEntries(catalog, "1.1.0"))).toEqual([]);
  });

  test("since equal to target is selected, for every kind and action alike", () => {
    const catalog = [
      entry("edge-manual", "1.1.0", "migration", "manual"),
      entry("edge-codemod", "1.1.0", "migration", "codemod"),
      entry("edge-deprecation", "1.1.0", "deprecation"),
    ];
    expect(ids(selectEntries(catalog, "1.1.0")).sort()).toEqual([
      "edge-codemod",
      "edge-deprecation",
      "edge-manual",
    ]);
  });

  test("a deprecation is selected whenever the replacement exists", () => {
    const catalog = [entry("dep", "0.2.0-alpha.1056", "deprecation")];
    expect(ids(selectEntries(catalog, "1.1.0"))).toEqual(["dep"]);
    expect(ids(selectEntries(catalog, "1.0.0"))).toEqual(["dep"]);
  });

  test("a deprecation whose replacement is not in the target yet is skipped", () => {
    const catalog = [entry("future", "2.0.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.1.0"))).toEqual([]);
  });

  test("alpha prereleases compare numerically, not as strings", () => {
    // `.10` is included against a target of `.11` under numeric comparison
    // (9 < 10 <= 11); a string comparison would exclude it (`"9" < "10"` is
    // false). A bound like .9-.11 proves the point only if the boundary
    // actually straddles a single-to-double-digit jump.
    const catalog = [
      entry("included", "0.2.0-alpha.10", "migration", "manual"),
    ];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.11"))).toEqual(["included"]);
  });

  test("results are ordered oldest first, the order the changes shipped", () => {
    const catalog = [
      entry("late", "0.2.0-alpha.1047", "migration", "codemod"),
      entry("early", "0.2.0-alpha.646", "migration", "codemod"),
      entry("middle", "0.2.0-alpha.712", "migration", "codemod"),
    ];
    expect(ids(selectEntries(catalog, "1.0.0"))).toEqual([
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
