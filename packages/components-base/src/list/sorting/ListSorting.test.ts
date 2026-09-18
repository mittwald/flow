import { fakeContext } from "../testing/fakeContext";
import { ListSorting } from "./ListSorting";
import { describe, expect, test } from "vitest";

interface Pilot {
  name: string;
}

const sorting = (
  shape: Partial<ConstructorParameters<typeof ListSorting<Pilot>>[1]> = {},
  context = fakeContext<Pilot>(),
) => ({
  context,
  sorting: new ListSorting<Pilot>(context, { property: "name", ...shape }),
});

describe("ListSorting", () => {
  test("defaults to ascending and off", () => {
    const { sorting: s } = sorting();

    expect(s.direction).toBe("asc");
    expect(s.initialEnabled).toBe(false);
  });

  test("turns the table's column on and remembers it", () => {
    const { context, sorting: s } = sorting({ direction: "desc" });

    s.enable();

    expect(context.column.sorted).toBe("desc");
    expect(context.stored).toEqual([
      { key: "sorting", value: { property: "name", direction: "desc" } },
    ]);
  });

  /*
   * `false` for the second argument is what keeps a list single-sorted:
   * enabling one sorting replaces the other rather than adding to it.
   */
  test("replaces the current sorting rather than adding to it", () => {
    const { context, sorting: s } = sorting();

    s.enable();

    expect(context.column.toggledWithoutMulti).toBe(true);
  });

  test("reads back what the table says", () => {
    const { context, sorting: s } = sorting({ direction: "asc" });

    expect(s.isSorted()).toBe(false);

    context.column.sorted = "asc";
    expect(s.isSorted()).toBe(true);

    context.column.sorted = "desc";
    expect(s.isSorted()).toBe(false);
  });

  test("clears", () => {
    const { context, sorting: s } = sorting();
    s.enable();

    s.clear();

    expect(context.column.sorted).toBe(false);
  });

  describe("the stored preference", () => {
    test("turns the matching sorting on", () => {
      const context = fakeContext<Pilot>({
        storedSorting: { property: "name", direction: "desc" },
      });

      const { sorting: s } = sorting({ direction: "desc" }, context);

      expect(s.initialEnabled).toBe(true);
    });

    /* Stored is one property *and* one direction — the pair is the setting. */
    test("leaves the other direction off", () => {
      const context = fakeContext<Pilot>({
        storedSorting: { property: "name", direction: "desc" },
      });

      const { sorting: s } = sorting({ direction: "asc" }, context);

      expect(s.initialEnabled).toBe(false);
    });

    test("does not override a hidden sorting", () => {
      const context = fakeContext<Pilot>({
        storedSorting: { property: "name", direction: "asc" },
      });

      const { sorting: s } = sorting({ defaultEnabled: "hidden" }, context);

      expect(s.initialEnabled).toBe("hidden");
    });
  });

  test("declares its column sortable, with a custom function if given", () => {
    const customSortingFn = (() => 0) as never;
    const { sorting: s } = sorting({ customSortingFn });
    const def = {};

    s.updateTableColumnDef(def);

    expect(def).toEqual({ enableSorting: true, sortingFn: customSortingFn });
  });
});
