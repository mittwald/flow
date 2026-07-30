import { afterEach, describe, expect, test, vitest } from "vitest";
import { createFrameResizeObserver } from "./createFrameResizeObserver";

const elements: HTMLElement[] = [];

const createElement = (width: number) => {
  const element = document.createElement("div");
  element.style.width = `${width}px`;
  element.style.height = "10px";
  document.body.append(element);
  elements.push(element);
  return element;
};

const setWidth = (element: HTMLElement, width: number) => {
  element.style.width = `${width}px`;
};

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * A `ResizeObserver` notification and the animation frame the measurement is
 * deferred to are separate ticks, so waiting for a single frame is not enough.
 */
const waitForMeasurement = async () => {
  await nextFrame();
  await nextFrame();
  await nextFrame();
};

afterEach(() => {
  for (const element of elements) {
    element.remove();
  }
  elements.length = 0;
});

describe("createFrameResizeObserver", () => {
  test("measures on the next animation frame instead of synchronously", async () => {
    const measure = vitest.fn();
    const observer = createFrameResizeObserver(measure);

    observer.schedule();
    expect(measure).not.toHaveBeenCalled();

    await waitForMeasurement();
    expect(measure).toHaveBeenCalledTimes(1);

    observer.disconnect();
  });

  test("coalesces repeated schedule calls into a single measurement", async () => {
    const measure = vitest.fn();
    const observer = createFrameResizeObserver(measure);

    observer.schedule();
    observer.schedule();
    observer.schedule();

    await waitForMeasurement();
    expect(measure).toHaveBeenCalledTimes(1);

    observer.disconnect();
  });

  test("measures when an observed element resizes", async () => {
    const measure = vitest.fn();
    const element = createElement(100);
    const observer = createFrameResizeObserver(measure);

    observer.observe([element]);
    await waitForMeasurement();
    measure.mockClear();

    setWidth(element, 200);
    await waitForMeasurement();
    expect(measure).toHaveBeenCalled();

    observer.disconnect();
  });

  test("drops previously observed elements when observing again", async () => {
    const measure = vitest.fn();
    const first = createElement(100);
    const second = createElement(100);
    const observer = createFrameResizeObserver(measure);

    observer.observe([first]);
    observer.observe([second]);
    await waitForMeasurement();
    measure.mockClear();

    setWidth(first, 200);
    await waitForMeasurement();
    expect(measure).not.toHaveBeenCalled();

    setWidth(second, 200);
    await waitForMeasurement();
    expect(measure).toHaveBeenCalled();

    observer.disconnect();
  });

  test("stops measuring after disconnect", async () => {
    const measure = vitest.fn();
    const element = createElement(100);
    const observer = createFrameResizeObserver(measure);

    observer.observe([element]);
    await waitForMeasurement();
    observer.disconnect();
    measure.mockClear();

    setWidth(element, 200);
    await waitForMeasurement();
    expect(measure).not.toHaveBeenCalled();
  });

  test("cancels a queued measurement on disconnect", async () => {
    const measure = vitest.fn();
    const observer = createFrameResizeObserver(measure);

    observer.schedule();
    observer.disconnect();

    await waitForMeasurement();
    expect(measure).not.toHaveBeenCalled();
  });
});
