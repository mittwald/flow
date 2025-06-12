import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";

test("TextField is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const field = dom.getByPlaceholder("field");
  await expect.element(field).toBeInTheDocument();
});

test("onPaste handler is triggered with clipboard data", async () => {
  const dom = renderRemoteTest("onPaste");
  const field = dom.getByPlaceholder("field");
  const source = dom.getByPlaceholder("copy-me");
  const pastedText = dom.getByTestId("pasted-text");

  await source.dblClick();
  await userEvent.copy();
  await field.click();
  await userEvent.paste();

  await expect.element(pastedText).toHaveTextContent("FOO");
});
