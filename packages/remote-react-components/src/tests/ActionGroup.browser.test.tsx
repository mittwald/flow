import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("ActionGroup is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const actionGroup = dom.getByTestId("actionGroup");
  await expect.element(actionGroup).toBeInTheDocument();
  const primaryButton = dom.getByTestId("primaryButton");
  await expect.element(primaryButton).toBeInTheDocument();
  const abortButton = dom.getByTestId("abortButton");
  await expect.element(abortButton).toBeInTheDocument();
  expect(primaryButton.element()).toHaveClass("flow--action-group--primary");
  expect(abortButton.element()).toHaveClass("flow--action-group--abort");
});
