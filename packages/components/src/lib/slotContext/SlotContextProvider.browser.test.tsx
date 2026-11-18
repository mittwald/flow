import type { ComponentType, PropsWithChildren } from "react";
import { memo } from "react";
import { beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useSlotContext } from "@/lib/slotContext/slotContext";

type SlottedComponentProps = PropsWithChildren<{
  slot?: string;
  testProp?: string;
}>;

const SlottedComponent = flowComponent("TestComponent", (props) => (
  <>{props.children}</>
)) as ComponentType<SlottedComponentProps>;

let consumerRenderCount: number;

const SlotContextConsumer = memo(() => {
  consumerRenderCount++;
  return <span data-testid="slot">{useSlotContext().TestComponent}</span>;
});

const renderSlotted = (slot: string, testProp: string) => (
  <SlottedComponent slot={slot} testProp={testProp}>
    <SlotContextConsumer />
  </SlottedComponent>
);

beforeEach(() => {
  consumerRenderCount = 0;
});

test("slot context consumers do not re-render when an unrelated prop changes", async () => {
  const { rerender } = await render(renderSlotted("primary", "a"));
  await expect.element(page.getByTestId("slot")).toHaveTextContent("primary");
  expect(consumerRenderCount).toBe(1);

  await rerender(renderSlotted("primary", "b"));
  expect(consumerRenderCount).toBe(1);

  await rerender(renderSlotted("secondary", "b"));
  await expect.element(page.getByTestId("slot")).toHaveTextContent("secondary");
  expect(consumerRenderCount).toBe(2);
});
