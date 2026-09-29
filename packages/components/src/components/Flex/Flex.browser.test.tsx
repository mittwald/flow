import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Flex } from "@/components/Flex";

const styleOf = (container: Element, testId: string) => {
  const element = container.querySelector(`[data-testid=${testId}]`);
  if (!element) {
    throw new Error(`No element with test id "${testId}" rendered`);
  }
  return getComputedStyle(element);
};

test("a consumer's class overrides a prop", async () => {
  const screen = await render(
    <>
      <style>
        {".flex-override { column-gap: 3px; flex-direction: column; }"}
      </style>
      <Flex data-testid="flex" gap="xl" className="flex-override" />
    </>,
  );

  const style = styleOf(screen.container, "flex");

  expect(style.columnGap).toBe("3px");
  expect(style.flexDirection).toBe("column");
});

test("a nested Flex does not inherit the props of its parent", async () => {
  const screen = await render(
    <Flex gap="xl" padding="xl" align="center" direction="column">
      <Flex data-testid="nested" />
    </Flex>,
  );

  const style = styleOf(screen.container, "nested");

  expect(style.columnGap).toBe("normal");
  expect(style.paddingTop).toBe("0px");
  expect(style.alignItems).toBe("normal");
  expect(style.flexDirection).toBe("row");
});
