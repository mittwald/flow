import { describe, expect, test } from "vitest";
import type { CatalogEntry } from "../catalog/entries";
import { selectEntries, sortBySince } from "../catalog/select";
import {
  compareSince,
  isUnreleased,
  unreleasedSince,
} from "../catalog/unreleased";

const entry = (id: string, since: string): CatalogEntry => ({
  id,
  since,
  title: id,
  kind: "migration",
  action: "manual",
  remotePackage: false,
  apply: "Do the thing.",
});

describe("the UNRELEASED placeholder", () => {
  test("is recognised only as the exact literal", () => {
    expect(isUnreleased(unreleasedSince)).toBe(true);
    expect(isUnreleased("unreleased")).toBe(false);
    expect(isUnreleased("1.2.0")).toBe(false);
  });

  test("compares above every real version, including a prerelease", () => {
    expect(compareSince(unreleasedSince, "1.2.0")).toBe(1);
    expect(compareSince("1.2.0", unreleasedSince)).toBe(-1);
    expect(compareSince(unreleasedSince, "99.0.0")).toBe(1);
    expect(compareSince(unreleasedSince, "1.2.0-next.13")).toBe(1);
    expect(compareSince(unreleasedSince, unreleasedSince)).toBe(0);
  });

  test("compares real versions by semver, not as strings", () => {
    expect(compareSince("0.2.0-alpha.712", "0.2.0-alpha.1046")).toBe(-1);
  });

  test("sorts last in the oldest-first order — it ships last", () => {
    const sorted = sortBySince([
      entry("unreleased-one", unreleasedSince),
      entry("shipped", "1.0.16"),
      entry("older", "1.0.0"),
    ]);

    expect(sorted.map(({ id }) => id)).toEqual([
      "older",
      "shipped",
      "unreleased-one",
    ]);
  });

  test("ties between two unreleased entries break by id", () => {
    const sorted = sortBySince([
      entry("b-entry", unreleasedSince),
      entry("a-entry", unreleasedSince),
    ]);

    expect(sorted.map(({ id }) => id)).toEqual(["a-entry", "b-entry"]);
  });

  test("is always selected — there is no version to gate it on", () => {
    // It only reaches a consumer through a `next` prerelease of the very
    // release it belongs to, so excluding it would hide exactly what that
    // channel exists to preview.
    const entries = [
      entry("unreleased-one", unreleasedSince),
      entry("shipped", "1.0.16"),
      entry("ahead", "2.0.0"),
    ];

    expect(selectEntries(entries, "1.0.16").map(({ id }) => id)).toEqual([
      "shipped",
      "unreleased-one",
    ]);
  });

  test("selection does not throw on the placeholder", () => {
    // `semver.lte("UNRELEASED", …)` throws `Invalid Version`; the whole point
    // of routing through `isUnreleased` first.
    expect(() =>
      selectEntries([entry("unreleased-one", unreleasedSince)], "1.2.0"),
    ).not.toThrow();
  });
});
