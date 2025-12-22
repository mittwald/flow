import { expect, test } from "vitest";
import { useForm } from "react-hook-form";
import {
  Form,
  Field,
  type FormOnSubmitHandler,
  ResetButton,
  SubmitButton,
} from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import type { FC } from "react";
import { TextField } from "@/components/TextField";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

interface Field {
  field: string;
}

const TestForm: FC<{ onSubmit: FormOnSubmitHandler<Field> }> = (props) => {
  const form = useForm<Field>({
    defaultValues: {
      field: "foo",
    },
  });
  return (
    <Form form={form} onSubmit={props.onSubmit}>
      <Field name="field">
        <TextField placeholder="textField" aria-label="test" />
      </Field>
      <ResetButton data-testid="resetButton" />
      <SubmitButton data-testid="submitButton" />
    </Form>
  );
};

const ui = () => ({
  submitButton: page.getByTestId("submitButton"),
  resetButton: page.getByTestId("resetButton"),
  textField: page.getByPlaceholder("textField"),
});

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Integration RHF ResetButton Tests", () => {
  test("will reset form when pressed", async () => {
    const asyncFunctionDuration = 10000;
    const form = <TestForm onSubmit={() => sleep(asyncFunctionDuration)} />;
    const { rerender } = await render(form);

    const { textField, resetButton, submitButton } = ui();

    await userEvent.type(textField, "bar");
    expect(textField).toHaveDisplayValue("foobar");
    await userEvent.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
    await userEvent.type(textField, "{end}bar");
    expect(textField).toHaveDisplayValue("foobar");

    expect(resetButton).not.toHaveAttribute("data-readonly");
    await userEvent.click(submitButton);
    await vitest.advanceTimersByTimeAsync(asyncFunctionDuration / 2);
    await rerender(form);
    expect(resetButton).toHaveAttribute("data-readonly");
    await vitest.advanceTimersByTimeAsync(asyncFunctionDuration);
    await rerender(form);
    expect(resetButton).not.toHaveAttribute("data-readonly");

    await userEvent.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
    await userEvent.type(textField, "{end}baz");
    expect(textField).toHaveDisplayValue("foobaz");
    await userEvent.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
  });
});
