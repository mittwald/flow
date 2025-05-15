import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { render, screen } from "@testing-library/react";
import { Input, InputContext, Label, TextField } from "react-aria-components";

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
