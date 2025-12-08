import { renderRemoteTest } from "./renderRemoteTest";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { userEvent } from "vitest/browser";

test("FileField is rendered", async () => {
  await renderRemoteTest("standard");
  const field = page.getByTestId("field");
  expect(field).toBeInTheDocument();
});

test("onChangeHandler is triggered with file", async () => {
  await renderRemoteTest("onChange");
  const field = page.getByTestId("field");
  await userEvent.upload(field, "e2e/tests/test.png");
  const bytes = page.getByTestId("uploaded-bytes");
  await expect
    .poll(() => expect(bytes).toHaveTextContent("86634"))
    .toBeTruthy();
});

test("onChangeHandler is triggered with multiple files", async () => {
  await renderRemoteTest("onChangeMultiple");
  const field = page.getByTestId("field");

  await userEvent.upload(field, ["e2e/tests/test.png", "e2e/tests/test2.png"]);
  const bytes = page.getByTestId("uploaded-bytes");
  await expect
    .poll(() => expect(bytes).toHaveTextContent("86634,145461"))
    .toBeTruthy();
});
