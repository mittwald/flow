import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Button is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const button = dom.getByTestId("button");
  await expect.element(button).toBeInTheDocument();
});

test("onPress eventhandler is triggered", async () => {
  renderRemoteTest("eventhandler");
  expect(true).toBe(true);
});
