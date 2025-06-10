import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";
import { userEvent } from "@vitest/browser/context";

test("SimpleForm is rendered", async () => {
  const dom = renderRemoteTest("standard");
  const form = dom.getByTestId("rendered-form");
  await expect.element(form).toBeInTheDocument();
});

test("ActionForm is rendered", async () => {
  const dom = renderRemoteTest("action");
  const form = dom.getByTestId("rendered-form");
  await expect.element(form).toBeInTheDocument();
});

test("onSubmitHandler is triggered with FormData", async () => {
  const dom = renderRemoteTest("onSubmit");

  await dom.getByTestId("form-checkbox-group-option1").click();
  await dom.getByTestId("form-checkbox-group-option2").click();
  await dom.getByPlaceholder("testInput").fill("textfieldExampleText");

  const select = dom.getByTestId("form-select");
  await userEvent.click(select);
  await userEvent.keyboard("[Tab][ArrowDown][ArrowDown][Enter]");

  await dom.getByTestId("form-filefield").upload("test.png");
  await dom.getByTestId("form-submit").click();

  const result = dom.getByTestId("form-result");
  await expect.element(result).toBeInTheDocument();

  expect(JSON.parse(result.element().textContent ?? "")).toEqual({
    data: [
      ["check", "read"],
      ["check", "write"],
      ["text", "textfieldExampleText"],
      ["select", "Bar"],
      ["certificates", {}],
    ],
    certificates: [
      {
        name: "test.png",
        resolvedDataLengthFromArrayBuffer: 86634,
      },
    ],
  });
});

test("actionHandler is triggered with FormData", async () => {
  const dom = renderRemoteTest("onAction");

  await dom.getByTestId("form-checkbox-group-option1").click();
  await dom.getByTestId("form-checkbox-group-option2").click();
  await dom.getByPlaceholder("testInput").fill("textfieldExampleText");

  const select = dom.getByTestId("form-select");
  await userEvent.click(select);
  await userEvent.keyboard("[Tab][ArrowDown][ArrowDown][Enter]");

  await dom.getByTestId("form-filefield").upload("test.png");
  await dom.getByTestId("form-submit").click();

  const result = dom.getByTestId("form-result");
  await expect.element(result).toBeInTheDocument();

  expect(JSON.parse(result.element().textContent ?? "")).toEqual({
    data: [
      ["check", "read"],
      ["check", "write"],
      ["text", "textfieldExampleText"],
      ["select", "Bar"],
      ["certificates", {}],
    ],
    certificates: [
      {
        name: "test.png",
        resolvedDataLengthFromArrayBuffer: 86634,
      },
    ],
  });
});
