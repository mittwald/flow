import { fakeContext } from "../testing/fakeContext";
import { ListSearch } from "./ListSearch";
import { describe, expect, test, vi } from "vitest";

describe("ListSearch", () => {
  test("puts the term into the table's global filter", () => {
    const context = fakeContext();
    const search = new ListSearch(context, {});

    search.setValue("wedge");

    expect(context.globalFilter).toBe("wedge");
    expect(search.value).toBe("wedge");
    expect(search.isSet).toBe(true);
  });

  test("clears", () => {
    const context = fakeContext();
    const search = new ListSearch(context, {});
    search.setValue("wedge");

    search.clear();

    expect(context.globalFilter).toBeUndefined();
    expect(search.isSet).toBe(false);
  });

  test("treats whitespace as no search", () => {
    const context = fakeContext();
    const search = new ListSearch(context, {});
    search.setValue("wedge");

    search.setValue("   ");

    expect(context.globalFilter).toBeUndefined();
  });

  /*
   * The loader resets on every update, so an empty search that reports itself
   * again would refetch on each keystroke that leaves the field empty.
   */
  test("says nothing when an empty search is cleared again", () => {
    const context = fakeContext();
    const search = new ListSearch(context, {});
    const updated = vi.fn();
    search.onUpdated(updated);

    search.setValue(undefined);

    expect(updated).not.toHaveBeenCalled();

    search.setValue("wedge");
    search.setValue(undefined);

    expect(updated).toHaveBeenCalledTimes(2);
  });

  test("stores every value it is given", () => {
    const context = fakeContext();
    const search = new ListSearch(context, { autosave: true });

    search.setValue("wedge");

    expect(context.stored).toEqual([
      { key: "search", value: { value: "wedge" } },
    ]);
  });

  describe("the initial value", () => {
    const initialStateOf = (search: ListSearch<unknown>) => {
      const initialState = {};
      search.updateInitialState(initialState);
      return initialState;
    };

    test("comes from the shape", () => {
      const search = new ListSearch(fakeContext(), {
        defaultValue: "wedge",
      });

      expect(initialStateOf(search)).toEqual({ globalFilter: "wedge" });
    });

    test("prefers what was stored", () => {
      const context = fakeContext({ storedSearch: { value: "biggs" } });
      const search = new ListSearch(context, { defaultValue: "wedge" });

      expect(initialStateOf(search)).toEqual({ globalFilter: "biggs" });
    });

    test("is nothing when neither exists", () => {
      const search = new ListSearch(fakeContext(), {});

      expect(initialStateOf(search)).toEqual({ globalFilter: undefined });
    });
  });
});
