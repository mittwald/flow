import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("DateRangePicker is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const element = dom.getByTestId("element");
  await expect.element(element).toBeInTheDocument();
});

test("DateRangePicker with value is rendered", async () => {
  const dom = renderRemoteTest("withValue");
  const element = dom.getByTestId("element");
  await expect.element(element).toBeInTheDocument();
  expect(element.element().textContent).toMatchInlineSnapshot(
    `"1.1.2025–2.1.2025"`,
  );
});
