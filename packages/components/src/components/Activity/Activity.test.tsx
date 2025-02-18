import { beforeEach, expect, vitest } from "vitest";
import { render } from "@testing-library/react";
import React, { act, useEffect } from "react";
import Activity from "@/components/Activity/index";

const rendering = vitest.fn();

const TestComponent = () => {
  useEffect(() => {
    rendering();
  }, [{}]);
  return null;
};

beforeEach(() => {
  vitest.resetAllMocks();
  vitest.useFakeTimers();
});

test("Does render children without any Activity", () => {
  render(<TestComponent />);
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does render children when wrapped in active Activity", () => {
  render(
    <Activity isActive={true}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does NOT render children when wrapped in inactive Activity", () => {
  render(
    <Activity isActive={false}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(0);
});

test("Does NOT render children when wrapped in delayed inactive Activity", () => {
  const node = (
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>
  );

  render(node);
  expect(rendering).toHaveBeenCalledTimes(0);
});

test("Does NOT render children when switching from active to inactive", () => {
  // initial render as active
  const r = render(
    <Activity isActive={true}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);

  // re-render as inactive
  r.rerender(
    <Activity isActive={false}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does NOT render children after delay when wrapped in delayed inactive Activity", () => {
  // initial render as active
  const r = render(
    <Activity isActive={true} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);

  // re-render as inactive
  r.rerender(
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(2);

  // re-render after elapsed timer
  act(() => vitest.advanceTimersToNextTimer());
  r.rerender(
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(2);
});
