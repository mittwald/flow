import { beforeEach, expect, vitest } from "vitest";
import { render } from "@testing-library/react";
import { useEffect } from "react";
import { CustomActivity } from "@/components/Activity/index";

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
    <CustomActivity isActive={true}>
      <TestComponent />
    </CustomActivity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});

test("Does NOT render children when wrapped in inactive Activity", () => {
  render(
    <CustomActivity isActive={false}>
      <TestComponent />
    </CustomActivity>,
  );
  expect(rendering).toHaveBeenCalledTimes(0);
});

test("Does NOT render children when switching from active to inactive", () => {
  // initial render as active
  const r = render(
    <CustomActivity isActive={true}>
      <TestComponent />
    </CustomActivity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);

  // re-render as inactive
  r.rerender(
    <CustomActivity isActive={false}>
      <TestComponent />
    </CustomActivity>,
  );
  expect(rendering).toHaveBeenCalledTimes(1);
});
