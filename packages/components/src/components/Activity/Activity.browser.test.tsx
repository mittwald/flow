import { beforeEach, expect } from "vitest";
import { render } from "vitest-browser-react";
import { Activity } from "@/components/Activity/index";
import { page } from "vitest/browser";

const TestComponent = () => {
  return <span role="status">Active</span>;
};

const testComponent = () =>
  page.getByRole("status", {
    includeHidden: false,
  });

beforeEach(() => {
  vi.useFakeTimers({
    shouldAdvanceTime: false,
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

test("Does render children without any Activity", async () => {
  await render(<TestComponent />);
  expect(testComponent()).toBeInTheDocument();
});

test("Does render children when wrapped in active Activity", async () => {
  await render(
    <Activity isActive={true} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();
});

test("Does NOT render children when wrapped in inactive Activity", async () => {
  await render(
    <Activity isActive={false} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children when wrapped in delayed inactive Activity", async () => {
  await render(
    <Activity isActive={false} inactiveDelay={1000} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children when switching from active to inactive", async () => {
  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  // re-render as inactive
  await rerender(
    <Activity isActive={false} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children after delay when wrapped in delayed inactive Activity", async () => {
  const delay = 5000;

  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  // re-render as inactive
  await rerender(
    <Activity isActive={false} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  await vitest.advanceTimersByTimeAsync(delay);
  // re-render after elapsed timer
  await rerender(
    <Activity isActive={false} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});
