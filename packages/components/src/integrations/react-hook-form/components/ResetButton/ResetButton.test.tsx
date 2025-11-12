import { expect, test } from "vitest";
import { render } from "@testing-library/react";
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
import { advanceTime, userEventFakeTimer } from "@/lib/dev/vitest";
import { TextField } from "@/components/TextField";

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
        <TextField data-testid="textField" />
      </Field>
      <ResetButton data-testid="resetButton" />
      <SubmitButton data-testid="submitButton" />
    </Form>
  );
};

describe("Integration RHF ResetButton Tests", () => {
  test("will reset form when pressed", async () => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const user = userEventFakeTimer;
    const asyncFunctionDuration = 10000;
    const form = <TestForm onSubmit={() => sleep(asyncFunctionDuration)} />;
    const renderResult = render(form);

    const submitButton = renderResult.getByTestId("submitButton");
    expect(submitButton).toBeInTheDocument();
    assert(submitButton);

    const resetButton = renderResult.getByTestId("resetButton");
    expect(resetButton).toBeInTheDocument();
    assert(resetButton);

    const textField = renderResult
      .getByTestId("textField")
      .querySelector("input");
    expect(textField).toBeInTheDocument();
    assert(textField);

    await user.type(textField, "bar");
    expect(textField).toHaveDisplayValue("foobar");
    await user.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
    await user.type(textField, "bar");
    expect(textField).toHaveDisplayValue("foobar");

    expect(resetButton).not.toHaveAttribute("data-readonly");
    await user.click(submitButton);
    await advanceTime(asyncFunctionDuration / 2);
    expect(resetButton).toHaveAttribute("data-readonly");
    await vi.runAllTimersAsync();
    expect(resetButton).not.toHaveAttribute("data-readonly");

    await user.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
    await user.type(textField, "baz");
    expect(textField).toHaveDisplayValue("foobaz");
    await user.click(resetButton);
    expect(textField).toHaveDisplayValue("foo");
  });
});
