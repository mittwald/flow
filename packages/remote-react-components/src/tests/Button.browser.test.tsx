import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("Button is rendered", async () => {
  const dom = await renderRemoteTest("standard");
  const button = dom.getByTestId("button");
  await expect.element(button).toBeInTheDocument();
});

test("onPress eventhandler is triggered", async () => {
  const dom = await renderRemoteTest("eventhandler");
  const button = dom.getByTestId("button");
  await button.click();
  const eventData = dom.getByTestId("event-data");
  await expect
    .element(eventData)
    .toHaveTextContent(
      `{"type":"press","pointerType":"mouse","target":null,"shiftKey":false,"metaKey":false,"ctrlKey":false,"altKey":false}`,
    );
});
