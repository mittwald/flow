import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";

test("TextField is rendered", async () => {
  const dom = await renderRemoteTest("standard");
  const field = dom.getByPlaceholder("field");
  await expect.element(field).toBeInTheDocument();
});

test("onPaste handler is triggered with clipboard data", async () => {
  const dom = await renderRemoteTest("onPaste");
  const field = dom.getByPlaceholder("field");
  const source = dom.getByPlaceholder("copy-me");
  const pastedText = dom.getByTestId("pasted-text");

  await source.dblClick();
  await userEvent.copy();
  await field.click();
  await userEvent.paste();

  await expect.element(pastedText).toHaveTextContent("FOO");
});

/**
 * Skipping this test as it currently errors in the @mittwald/remote-dom-react
 * package:
 *
 * TypeError: listener is not a function ❯ Object.eventListenerCallbackWrapper
 * [as onChange]
 * ../../node_modules/.pnpm/@mittwald+remote-dom-react@1.2.2-mittwald.10_@preact+signals-core@1.12.1_react@19.2.0/node_modules/@mittwald/remote-dom-react/build/esm/host/hooks/props-for-element.mjs:54:11
 */
test.skip("value of textfield equals typed text on blocking validation", async () => {
  const dom = await renderRemoteTest("blockingValidation");
  const field = dom.getByPlaceholder("field");
  await userEvent.type(field, "{h}{e}{l}{l}{o}{,}{ }{w}{o}{r}{l}{d}{!}");
  await expect.element(field).toHaveValue("hello, world!");
});
