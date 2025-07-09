import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("ContexMenu opens with trigger", async () => {
  const dom = renderRemoteTest("standard");
  const button = dom.getByTestId("trigger");
  const menuItem = dom.getByTestId("menu-item");
  await expect.element(menuItem).not.toBeInTheDocument();
  await button.click();
  await expect.element(menuItem).toBeInTheDocument();
});
