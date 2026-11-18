import { CalendarDate } from "@internationalized/date";
import { describe, expect, test, vi } from "vitest";
import { fakeContext } from "../testing/fakeContext";
import { ListDateRangeFilter } from "./ListDateRangeFilter";

interface Run {
  name: string;
}

const filterWith = (onChange = vi.fn()) => {
  const filter = new ListDateRangeFilter<Run, "name">(fakeContext<Run>(), {
    property: "name",
    mode: "dateRange",
    onChange,
  });
  return { filter, onChange };
};

describe("ListDateRangeFilter", () => {
  /*
   * The list resets its batches and its loader on this notification. Without
   * it, a list with a loader kept showing the rows of the range before.
   */
  test("tells its listeners a range was set", () => {
    const { filter, onChange } = filterWith();
    const range = { start: new CalendarDate(2026, 3, 10), end: undefined };

    filter.setValue(range);

    expect(filter.getValue()).toBe(range);
    expect(onChange).toHaveBeenCalledWith([range]);
  });
});
