import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Input, InputContext, Label, TextField } from "react-aria-components";
import { sleep } from "@/lib/promises/sleep";

beforeEach(() => {
  vitest.resetAllMocks();
});

test("value is not present in input if not set by props", () => {
  render(
    <TextField>
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={InputContext} props={{}}>
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  expect(input).not.toHaveAttribute("value");
});

test("value is present in input if set by props", () => {
  render(
    <TextField>
      <Label>Test</Label>
      <ReactAriaControlledValueFix
        inputContext={InputContext}
        props={{ value: "test" }}
      >
        <Input data-testid="input" />
      </ReactAriaControlledValueFix>
    </TextField>,
  );

  const input = screen.getByTestId("input");
  expect(input).not.toHaveAttribute("value", "test");
});

test("other aria attributes are set", () => {
  render(
    <TextField>
      <Label>Test</Label>
      <ReactAriaControlledValueFix inputContext={InputContext} props={{}}>
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
      <ReactAriaControlledValueFix inputContext={InputContext} props={{}}>
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
});
