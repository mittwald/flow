import { describe, expect, test } from "vitest";
import { getVisibleItemCount } from "./getVisibleItemCount";

describe("getVisibleItemCount", () => {
  test("returns all items when they fit into the available width", () => {
    expect(getVisibleItemCount([100, 100, 100], 300, 50)).toBe(3);
  });

  test("ignores the more item width when all items fit", () => {
    expect(getVisibleItemCount([100, 100, 100], 300, 500)).toBe(3);
  });

  test("reserves the more item width when items overflow", () => {
    // 300px available, 50px reserved for "more": only 2 x 100px items fit
    expect(getVisibleItemCount([100, 100, 100, 100], 300, 50)).toBe(2);
  });

  test("returns 0 when not even the first item fits", () => {
    expect(getVisibleItemCount([200, 200], 100, 50)).toBe(0);
  });

  test("returns 0 for an empty item list", () => {
    expect(getVisibleItemCount([], 100, 50)).toBe(0);
  });

  test("tolerates sub-pixel rounding differences", () => {
    expect(getVisibleItemCount([100.4, 100.4, 100.4], 301, 50)).toBe(3);
  });

  test("hides all items when only the more item fits", () => {
    expect(getVisibleItemCount([100, 100], 120, 60)).toBe(0);
  });
});
