import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "@vitest/browser/context";
import { cleanup } from "vitest-browser-react";

const ui = () => ({
  submitButton: page.getByTestId("form-submit"),
  result: page.getByTestId("form-result"),
  select: page.getByText("Element wählen"),
  checkboxGroupOption1: page.getByTestId("form-checkbox-group-option1"),
  checkboxGroupOption2: page.getByTestId("form-checkbox-group-option2"),
  fileField: page.getByTestId("form-filefield"),
  input: page.getByPlaceholder("testInput"),
  form: page.getByTestId("rendered-form"),
  expectResult: async (data: unknown) => {
    const result = page.getByTestId("form-result");
    await expect.poll(() => expect(result).toBeInTheDocument()).toBeTruthy();
    expect(JSON.parse(result.element().textContent ?? "")).toEqual(data);
  },
});

afterEach(() => {
  cleanup();
});

test("SimpleForm is rendered", async () => {
  await renderRemoteTest("standard");
  const { form } = ui();
  expect(form).toBeInTheDocument();

  const { submitButton, result } = ui();
  await userEvent.click(submitButton);
  await expect.element(result).toBeInTheDocument();
  expect(JSON.parse(result.element().textContent ?? "")).toEqual({});
});

test("ActionForm is rendered", async () => {
  await renderRemoteTest("action");
  const { form } = ui();
  expect(form).toBeInTheDocument();

  const { submitButton, result } = ui();
  await userEvent.click(submitButton);
  await expect.element(result).toBeInTheDocument();
  expect(JSON.parse(result.element().textContent ?? "")).toEqual({});
});

test("onSubmitHandler is triggered with FormData", async () => {
  await renderRemoteTest("onSubmit");

  const {
    checkboxGroupOption1,
    checkboxGroupOption2,
    select,
    fileField,
    submitButton,
    input,
    expectResult,
  } = ui();

  await userEvent.click(checkboxGroupOption1);
  await userEvent.click(checkboxGroupOption2);
  await userEvent.fill(input, "textfieldExampleText");

  await userEvent.click(select);
  await userEvent.keyboard("[ArrowDown][ArrowDown][Enter]");

  await userEvent.upload(fileField, [
    "src/tests/test.png",
    "src/tests/test2.png",
  ]);
  await userEvent.click(submitButton);

  await expectResult({
    data: [
      ["check", "read"],
      ["check", "write"],
      ["text", "textfieldExampleText"],
      ["select", "Bar"],
      ["certificates", {}],
      ["certificates", {}],
    ],
    certificates: [
      {
        name: "test.png",
        resolvedDataLengthFromArrayBuffer: 86634,
      },
      {
        name: "test2.png",
        resolvedDataLengthFromArrayBuffer: 145461,
      },
    ],
  });
});

test("actionHandler is triggered with FormData", async () => {
  await renderRemoteTest("onAction");

  const {
    checkboxGroupOption1,
    submitButton,
    checkboxGroupOption2,
    input,
    select,
    fileField,
    expectResult,
  } = ui();

  await checkboxGroupOption1.click();
  await checkboxGroupOption2.click();
  await input.fill("textfieldExampleText");

  await userEvent.click(select);
  await userEvent.keyboard("[ArrowDown][ArrowDown][Enter]");

  await userEvent.upload(fileField, [
    "src/tests/test.png",
    "src/tests/test2.png",
  ]);
  await userEvent.click(submitButton);

  await expectResult({
    data: [
      ["check", "read"],
      ["check", "write"],
      ["text", "textfieldExampleText"],
      ["select", "Bar"],
      ["certificates", {}],
      ["certificates", {}],
    ],
    certificates: [
      {
        name: "test.png",
        resolvedDataLengthFromArrayBuffer: 86634,
      },
      {
        name: "test2.png",
        resolvedDataLengthFromArrayBuffer: 145461,
      },
    ],
  });
});
