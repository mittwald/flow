import { describe, expect, test } from "vitest";
import {
  clampTranslation,
  initialZoomTransform,
  panBy,
  visibleArea,
  type ZoomFrame,
  zoomTo,
} from "./zoomTransform";

/* A 400 × 200 area in the middle of a 1000 × 600 screen. */
const frame: ZoomFrame = {
  width: 400,
  height: 200,
  screen: { left: -500, right: 500, top: -300, bottom: 300 },
};
const center = { x: 0, y: 0 };

describe("zoomTo", () => {
  test("keeps the content under the origin in place", () => {
    const zoomed = zoomTo(initialZoomTransform, 2, 3, frame, { x: 100, y: 50 });

    expect(zoomed).toEqual({ scale: 2, x: -100, y: -50 });
    // The content point under (100, 50) is still there: 2 * 100 - 100.
    expect(zoomed.scale * 100 + zoomed.x).toBe(100);
  });

  test("moves the content under the origin to the pointer", () => {
    const zoomed = zoomTo(
      initialZoomTransform,
      2,
      3,
      frame,
      { x: 0, y: 0 },
      { x: 20, y: 10 },
    );

    expect(zoomed).toEqual({ scale: 2, x: 20, y: 10 });
  });

  test("stays between 1 and the maximum scale", () => {
    expect(zoomTo(initialZoomTransform, 5, 3, frame, center).scale).toBe(3);
    expect(zoomTo({ scale: 2, x: 50, y: 20 }, 0.5, 3, frame, center)).toEqual(
      initialZoomTransform,
    );
  });

  test("keeps content smaller than the screen inside it", () => {
    // 800px wide on a 1000px screen: at most 100px off center.
    const zoomed = zoomTo(initialZoomTransform, 2, 3, frame, { x: 400, y: 0 });

    expect(zoomed.x).toBe(-100);
  });
});

describe("panBy", () => {
  test("moves content larger than the screen up to its edges", () => {
    // 1200 × 600 on a 1000 × 600 screen: 100px to either side, none up or down.
    const zoomed = { scale: 3, x: 0, y: 0 };

    expect(panBy(zoomed, { x: 50, y: -30 }, frame)).toEqual({
      scale: 3,
      x: 50,
      y: 0,
    });
    expect(panBy(zoomed, { x: 500, y: 500 }, frame)).toEqual({
      scale: 3,
      x: 100,
      y: 0,
    });
  });

  test("does not move unzoomed content", () => {
    expect(panBy(initialZoomTransform, { x: 50, y: 50 }, frame)).toEqual(
      initialZoomTransform,
    );
  });
});

test("clampTranslation keeps the scale", () => {
  expect(clampTranslation({ scale: 3, x: -1000, y: 1000 }, frame)).toEqual({
    scale: 3,
    x: -100,
    y: 0,
  });
});

describe("visibleArea", () => {
  test("is the area itself while unzoomed", () => {
    expect(visibleArea(initialZoomTransform, frame)).toEqual({
      left: 0,
      top: 0,
      width: 400,
      height: 200,
    });
  });

  test("is cut off at the screen's edges while zoomed", () => {
    // 1200 × 600 shifted 100px right covers the whole 1000 × 600 screen, which
    // starts 300px left of and 200px above the unscaled area.
    expect(visibleArea({ scale: 3, x: 100, y: 0 }, frame)).toEqual({
      left: -300,
      top: -200,
      width: 1000,
      height: 600,
    });
  });
});
