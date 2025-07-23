import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";

test("FileField is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const field = dom.getByTestId("field");
  await expect.element(field).toBeInTheDocument();
});

test("onChangeHandler is triggered with file", async () => {
  const dom = renderRemoteTest("onChange");
  const field = dom.getByTestId("field");
  await field.upload("src/tests/test.png");
  const bytes = dom.getByTestId("uploaded-bytes");
  await expect.element(bytes).toBeInTheDocument();
  expect(bytes.element().textContent).toBe("86634");
});

test("onChangeHandler is triggered with multiple files", async () => {
  const dom = renderRemoteTest("onChangeMultiple");
  const field = dom.getByTestId("field");
  await field.upload(["src/tests/test.png", "src/tests/test2.png"]);
  const bytes = dom.getByTestId("uploaded-bytes");
  await expect.element(bytes).toBeInTheDocument();
  expect(bytes.element().textContent).toBe("86634,145461");
});
