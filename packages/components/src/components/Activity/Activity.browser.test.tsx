import { beforeEach, expect, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { useEffect } from "react";
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

test("Does render children without any Activity", async () => {
  await render(<TestComponent />);
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does render children when wrapped in active Activity", async () => {
  await render(
    <Activity isActive={true}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does NOT render children when wrapped in inactive Activity", async () => {
  await render(
    <Activity isActive={false}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(0);
});

test("Does NOT render children when wrapped in delayed inactive Activity", async () => {
  const node = (
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>
  );

  await render(node);
  expect(rendering).toHaveBeenCalledTimes(0);
});

test("Does NOT render children when switching from active to inactive", async () => {
  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);

  // re-render as inactive
  await rerender(
    <Activity isActive={false}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does NOT render children after delay when wrapped in delayed inactive Activity", async () => {
  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);

  // re-render as inactive
  await rerender(
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(2);

  // re-render after elapsed timer
  await vitest.advanceTimersToNextTimerAsync();
  await rerender(
    <Activity isActive={false} inactiveDelay={1000}>
      <TestComponent />
    </Activity>,
  );
  expect(rendering).toHaveBeenCalledTimes(2);
});
