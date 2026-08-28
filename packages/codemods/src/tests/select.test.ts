import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import {
  hiddenEarlierManualCount,
  selectEntries,
  sortBySince,
} from "../catalog/select";

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
  test("a manual migration is selected only when the range crosses it", () => {
    // `action: "manual"` on purpose — there is no no-op for a person to fall
    // back on, so the lower bound (current < since) still has to hold.
    const catalog = [
      entry("crossed", "0.2.0-alpha.646", "migration", "manual"),
    ];
    expect(ids(selectEntries(catalog, "0.2.0-alpha.640", "1.0.1"))).toEqual([
      "crossed",
    ]);
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("a codemod entry behind current is selected — re-running it is a no-op", () => {
    // The whole point of the change: dropping the lower bound for codemods
    // because idempotency.test.ts proves re-applying one is a no-op, so there
    // is nothing the lower bound was protecting against.
    const catalog = [
      entry("already-shipped", "0.2.0-alpha.646", "migration", "codemod"),
    ];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([
      "already-shipped",
    ]);
  });

  test("a codemod entry is still excluded once it is ahead of target", () => {
    const catalog = [entry("not-yet", "2.0.0", "migration", "codemod")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([]);
  });

  test("since equal to target is crossed, since equal to current is not — manual", () => {
    const catalog = [entry("edge", "1.1.0", "migration", "manual")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
    expect(ids(selectEntries(catalog, "1.1.0", "1.2.0"))).toEqual([]);
  });

  test("since equal to current is selected for a codemod, unlike a manual migration", () => {
    const catalog = [entry("edge-codemod", "1.1.0", "migration", "codemod")];
    expect(ids(selectEntries(catalog, "1.1.0", "1.2.0"))).toEqual([
      "edge-codemod",
    ]);
  });

  test("since equal to target is crossed for a codemod too", () => {
    const catalog = [entry("edge-codemod", "1.1.0", "migration", "codemod")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual([
      "edge-codemod",
    ]);
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

  test("alpha prereleases compare numerically, not as strings", () => {
    // The bounds straddle a single-to-double-digit boundary on purpose: numeric
    // comparison includes `.10` (9 < 10 <= 11), a string comparison excludes it
    // (`"9" < "10"` is false). Bounds like .700-.800 around .712/.1046 pass under
    // both a correct and a naive string implementation, so they prove nothing.
    const catalog = [
      entry("included", "0.2.0-alpha.10", "migration", "manual"),
    ];
    expect(
      ids(selectEntries(catalog, "0.2.0-alpha.9", "0.2.0-alpha.11")),
    ).toEqual(["included"]);
  });

  test("a deprecation whose since equals the target is selected", () => {
    const catalog = [entry("edge", "1.1.0", "deprecation")];
    expect(ids(selectEntries(catalog, "1.0.0", "1.1.0"))).toEqual(["edge"]);
  });

  test("the next line is crossed like any other range", () => {
    const catalog = [entry("n", "1.1.0-next.5", "migration", "manual")];
    expect(ids(selectEntries(catalog, "1.1.0-next.3", "1.1.0-next.7"))).toEqual(
      ["n"],
    );
  });

  test("results are ordered oldest first, the order the changes shipped", () => {
    const catalog = [
      entry("late", "0.2.0-alpha.1047", "migration", "codemod"),
      entry("early", "0.2.0-alpha.646", "migration", "codemod"),
      entry("middle", "0.2.0-alpha.712", "migration", "codemod"),
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

describe("hiddenEarlierManualCount", () => {
  test("counts manual and no-code-change migrations at or behind current", () => {
    const catalog = [
      entry("old-manual", "1.0.0", "migration", "manual"),
      entry("old-none", "1.0.5", "migration", "none"),
      entry("future-manual", "2.0.0", "migration", "manual"),
      entry("old-codemod", "1.0.0", "migration", "codemod"),
      entry("old-deprecation", "1.0.0", "deprecation"),
    ];

    // Only the two migrations whose `since` is <= current and whose action
    // needs a person — a codemod is idempotent and never hidden, a
    // deprecation is a different kind entirely, and the future migration is
    // not behind current at all.
    expect(hiddenEarlierManualCount(catalog, "1.1.0")).toBe(2);
  });

  test("nothing is hidden once current is behind every migration's since", () => {
    const catalog = [entry("ahead", "2.0.0", "migration", "manual")];
    expect(hiddenEarlierManualCount(catalog, "1.0.0")).toBe(0);
  });

  test("since equal to current counts as hidden", () => {
    const catalog = [entry("edge", "1.0.0", "migration", "manual")];
    expect(hiddenEarlierManualCount(catalog, "1.0.0")).toBe(1);
  });
});
