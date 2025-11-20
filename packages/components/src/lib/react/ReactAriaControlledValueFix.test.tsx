import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  Input,
  InputContext,
  Label,
  TextField,
  TextFieldContext,
} from "react-aria-components";
import { sleep } from "@/lib/promises/sleep";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { TextField as FlowTextField } from "@/components/TextField";
import { Field, Form, ResetButton } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";

beforeEach(() => {
  vitest.resetAllMocks();
});

test("will reset in form", async () => {
  const user = userEvent;

  const TestForm = () => {
    const form = useForm({
      defaultValues: {
        test: "default",
      },
    });
    return (
      <Form form={form} onSubmit={() => null}>
        <Field name="test">
          <FlowTextField data-testid="field">
            <Label>Test</Label>
          </FlowTextField>
        </Field>
        <ResetButton data-testid="reset" />
      </Form>
    );
  };

  render(<TestForm />);

  const input = screen.getByTestId("field").querySelector("input");
  expect(input).toBeInTheDocument();
  assert(input);

  expect(input).toHaveDisplayValue("default");
  await user.type(input, "123");
  expect(input).toHaveDisplayValue("default123");

  const resetButton = screen.getByTestId("reset");

  await user.click(resetButton);
  expect(input).toHaveDisplayValue("default");

  await user.click(resetButton);
  expect(input).toHaveDisplayValue("default");
});

test("defaultValue is present and not controlled over value attribute", async () => {
  const user = userEvent;

  render(
    <TextField value="default">
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={TextFieldContext}>
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  expect(input).not.toHaveAttribute("value");
  expect(input).toHaveDisplayValue("default");

  await user.type(input, "123");
  expect(input).toHaveDisplayValue("default123");
  expect(input).not.toHaveAttribute("value");
});

test("defaultValue is not present and not controlled over value attribute", async () => {
  const user = userEvent;

  render(
    <TextField>
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={InputContext}>
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  expect(input).not.toHaveAttribute("value");
  expect(input).toHaveDisplayValue("");

  await user.type(input, "123");
  expect(input).toHaveDisplayValue("123");
  expect(input).not.toHaveAttribute("value");
});

test("other aria attributes are set", () => {
  render(
    <TextField>
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={InputContext}>
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  expect(input).toHaveAttribute("aria-labelledby");
});

test("onChange is emitted", async () => {
  const onChangeHandler = vi.fn();
  render(
    <TextField onChange={onChangeHandler}>
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={InputContext}>
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  await act(async () => {
    fireEvent.change(input, { target: { value: "123" } });
    await sleep(250);
  });

  expect(input).toHaveAttribute("aria-labelledby");
  expect(onChangeHandler).toHaveBeenLastCalledWith("123");

  await act(async () => {
    fireEvent.change(input, { target: { value: "" } });
    await sleep(250);
  });
  expect(onChangeHandler).toHaveBeenLastCalledWith("");
});
