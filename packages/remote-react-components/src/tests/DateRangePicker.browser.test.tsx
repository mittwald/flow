import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("DateRangePicker is rendered", async () => {
  const dom = await renderRemoteTest("standard");
  const element = dom.getByTestId("element");
  await expect.element(element).toBeInTheDocument();
});

test("DateRangePicker with value is rendered", async () => {
  const dom = await renderRemoteTest("withValue");
  const element = dom.getByTestId("element");
  await expect.element(element).toBeInTheDocument();

  const content = element.element().textContent;
  expect(["1.1.2025–2.1.2025"]).toContain(content);
});
