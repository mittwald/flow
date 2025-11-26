import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";

test("Button is rendered", async () => {
  const dom = await renderRemoteTest("standard");
  const button = dom.getByTestId("button");
  await expect.element(button).toBeInTheDocument();
});

test("copies text onPress", async () => {
  const dom = await renderRemoteTest("eventhandler");
  const button = dom.getByTestId("button");
  await button.click();
  const input = dom.getByLabelText("Input");
  await userEvent.click(input);
  await userEvent.paste();
  expect(input.element()).toHaveDisplayValue("copy-me");
});
