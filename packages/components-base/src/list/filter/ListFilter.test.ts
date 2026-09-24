import { fakeContext, type FakeContext } from "../testing/fakeContext";
import { ListFilter } from "./ListFilter";
import type { FilterMode } from "./types";
import type { InitialTableState, Row } from "@tanstack/table-core";
import { describe, expect, test, vi } from "vitest";

interface Pilot {
  name: string;
  squadron: { id: string };
}

type PilotFilter = ListFilter<Pilot, "name", string>;

const filterOn = (
  context: FakeContext<Pilot>,
  shape: Partial<
    ConstructorParameters<typeof ListFilter<Pilot, "name", string>>[1]
  > = {},
): PilotFilter =>
  new ListFilter<Pilot, "name", string>(context, {
    property: "name",
    values: ["wedge", "biggs"],
    ...shape,
  });

/** The predicate the table runs, called the way the table calls it. */
const matches = (
  filter: PilotFilter,
  pilot: Pilot,
  value: unknown,
): boolean => {
  const def: { filterFn?: unknown } = {};
  filter.updateTableColumnDef(def as never);
  const filterFn = def.filterFn as (
    row: Row<Pilot>,
    id: string,
    value: unknown,
  ) => boolean;
  return filterFn({ original: pilot } as Row<Pilot>, "name", value);
};

const pilot = (name: string): Pilot => ({ name, squadron: { id: "red" } });

describe("ListFilter", () => {
  /*
   * A filter without fixed values offers what the data has — and with an
   * async loader the data is not there when the filter is built. React gets
   * away with reading it once because its model is rebuilt every render; a
   * binding that keeps one instance would show an empty menu forever.
   */
  test("offers values the data only gains later", () => {
    const facetedValues: unknown[] = [];
    const context = fakeContext<Pilot>({ facetedValues });
    const filter = new ListFilter<Pilot, "name", string>(context, {
      property: "name",
    });

    expect(filter.values).toHaveLength(0);

    facetedValues.push("wedge", "biggs");

    expect(filter.values.map((value) => value.value)).toEqual([
      "wedge",
      "biggs",
    ]);
  });

  /*
   * The filter function resolves every stored id through `values`, once per
   * row — rebuilding them on each read hashed every value that often.
   */
  test("builds its values once per faceted-values map", () => {
    let facets = new Map<unknown, number>([["wedge", 1]]);
    const context = fakeContext<Pilot>({ facets: () => facets });
    const filter = new ListFilter<Pilot, "name", string>(context, {
      property: "name",
    });

    const first = filter.values;
    expect(filter.values).toBe(first);

    facets = new Map([["biggs", 1]]);
    expect(filter.values.map((value) => value.value)).toEqual(["biggs"]);
  });

  describe("selecting", () => {
    test("adds and removes a value", () => {
      const context = fakeContext<Pilot>();
      const filter = filterOn(context);
      const wedge = filter.values[0];
      expect(wedge).toBeDefined();
      if (!wedge) return;

      wedge.toggle();
      expect(filter.isActive()).toBe(true);
      expect(filter.isValueActive(wedge)).toBe(true);

      wedge.toggle();
      expect(filter.isActive()).toBe(false);
    });

    test("collects several in 'some' mode", () => {
      const context = fakeContext<Pilot>();
      const filter = filterOn(context, { mode: "some" });

      filter.values.forEach((v) => v.toggle());

      expect(filter.getArrayValue()).toHaveLength(2);
    });

    /* `one` is a radio group: picking replaces rather than adds. */
    test("replaces in 'one' mode", () => {
      const context = fakeContext<Pilot>();
      const filter = filterOn(context, { mode: "one" });

      filter.values[0]?.toggle();
      filter.values[1]?.toggle();

      expect(filter.getArrayValue().map((v) => v.value)).toEqual(["biggs"]);
    });

    test("tells its listeners the values, not the wrappers", () => {
      const onChange = vi.fn();
      const filter = filterOn(fakeContext<Pilot>(), { onChange });

      filter.values[0]?.toggle();

      expect(onChange).toHaveBeenCalledWith(["wedge"]);
    });

    test("clears", () => {
      const filter = filterOn(fakeContext<Pilot>());
      filter.values[0]?.toggle();

      filter.clear();

      expect(filter.isActive()).toBe(false);
    });
  });

  describe("the predicate", () => {
    test.each([
      ["some", ["wedge", "biggs"], true],
      ["some", ["biggs"], false],
      ["all", ["wedge"], true],
      ["all", ["wedge", "biggs"], false],
      ["one", ["wedge"], true],
      ["one", ["biggs"], false],
    ] as [FilterMode, string[], boolean][])(
      "in '%s' mode, %j matches %s",
      (mode, selected, expected) => {
        const filter = filterOn(fakeContext<Pilot>(), { mode });

        expect(matches(filter, pilot("wedge"), selected)).toBe(expected);
      },
    );

    /* Nothing selected filters nothing away. */
    test("lets everything through with no selection", () => {
      const filter = filterOn(fakeContext<Pilot>());

      expect(matches(filter, pilot("wedge"), null)).toBe(true);
      expect(matches(filter, pilot("wedge"), [])).toBe(true);
    });

    test("reads a nested property", () => {
      const context = fakeContext<Pilot>({ columnIds: ["squadron.id"] });
      const filter = new ListFilter<Pilot, "squadron.id", string>(context, {
        property: "squadron.id",
        values: ["red"],
      });

      expect(matches(filter as never, pilot("wedge"), ["red"])).toBe(true);
      expect(matches(filter as never, pilot("wedge"), ["gold"])).toBe(false);
    });

    /*
     * A `$`-prefixed property is not on the item, so the matcher is handed the
     * item itself and decides — which is what makes a computed filter possible.
     */
    test("hands a custom property the whole item", () => {
      const context = fakeContext<Pilot>({ columnIds: ["$veteran"] });
      const matcher = vi.fn(() => true);
      const filter = new ListFilter<Pilot, "$veteran", string>(context, {
        property: "$veteran",
        values: ["yes"],
        matcher: matcher as never,
      });

      matches(filter as never, pilot("wedge"), ["yes"]);

      expect(matcher).toHaveBeenCalledWith("yes", pilot("wedge"));
    });
  });

  describe("persistence", () => {
    test("starts from the values the shape defaults to", () => {
      const filter = filterOn(fakeContext<Pilot>(), {
        defaultSelected: ["wedge"],
      });
      const initialState: InitialTableState = {};

      filter.updateInitialState(initialState);

      expect(initialState.columnFilters).toHaveLength(1);
    });

    test("prefers what was stored over the default", () => {
      const context = fakeContext<Pilot>();
      const reference = filterOn(context, { defaultSelected: ["wedge"] });
      const storedId = reference.values[1]?.id ?? "";

      const stored = fakeContext<Pilot>({
        storedActiveFilters: { name: [storedId] },
      });
      const filter = filterOn(stored, { defaultSelected: ["wedge"] });
      const initialState: InitialTableState = {};

      filter.updateInitialState(initialState);

      expect(initialState.columnFilters?.[0]?.value).toEqual([storedId]);
    });

    test("writes every filter's ids under its storage key", () => {
      const context = fakeContext<Pilot>();
      const filter = filterOn(context);
      filter.values[0]?.toggle();

      ListFilter.storeFilters(context, [filter], { autosave: true });

      expect(context.stored.at(-1)).toEqual({
        key: "activeFilters",
        value: { name: [filter.values[0]?.id] },
      });
    });

    test("reports a change against the stored selection", () => {
      const filter = filterOn(fakeContext<Pilot>());

      expect(filter.hasChanges()).toBe(false);

      filter.values[0]?.toggle();
      expect(filter.hasChanges()).toBe(true);
    });
  });

  /*
   * A stored selection whose value is gone would filter everything away, with
   * no control left to switch it off — the id survives a reload, the value
   * behind it does not have to.
   */
  test("drops a selection the filter no longer offers", () => {
    const context = fakeContext<Pilot>();
    const filter = filterOn(context);
    filter.values[0]?.toggle();
    expect(filter.getArrayValue()).toHaveLength(1);

    context.columnFilters = [
      { id: "name", value: ["FilterValueId@@name@@gone"] },
    ];

    filter.deleteUnknownFilterValues();

    expect(filter.getArrayValue()).toHaveLength(0);
  });

  /*
   * Nothing to drop when the values *are* the data: a filter without fixed
   * values offers whatever the table has seen, so no selection can be unknown.
   */
  test("leaves a data-driven filter alone", () => {
    const context = fakeContext<Pilot>({ facetedValues: ["biggs"] });
    const filter = new ListFilter<Pilot, "name", string>(context, {
      property: "name",
    });
    filter.values[0]?.toggle();

    filter.deleteUnknownFilterValues();

    expect(filter.getArrayValue()).toHaveLength(1);
  });
});
