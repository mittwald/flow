import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { NumberField } from "@/components/NumberField";
import { Label } from "@/components/Label";

// react-aria labels the stepper buttons after the field.
const increase = () => page.getByRole("button", { name: "Increase Age" });
const decrease = () => page.getByRole("button", { name: "Decrease Age" });
const input = () => page.getByRole("textbox", { name: "Age" });

const renderField = (props?: {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  onChange?: (value: number) => void;
}) =>
  render(
    <NumberField {...props}>
      <Label>Age</Label>
    </NumberField>,
  );

test("the stepper buttons raise and lower the value", async () => {
  const onChange = vi.fn();
  renderField({ defaultValue: 5, onChange });

  await increase().click();

  await expect.element(input()).toHaveValue("6");
  expect(onChange).toHaveBeenLastCalledWith(6);

  await decrease().click();
  await decrease().click();

  await expect.element(input()).toHaveValue("4");
  expect(onChange).toHaveBeenLastCalledWith(4);
});

test("step sets how far one press moves the value", async () => {
  renderField({ defaultValue: 10, step: 5 });

  await increase().click();

  await expect.element(input()).toHaveValue("15");
});

test("the stepper stops at minValue and maxValue", async () => {
  renderField({ defaultValue: 6, minValue: 5, maxValue: 7 });

  await increase().click();

  await expect.element(input()).toHaveValue("7");
  await expect.element(increase()).toBeDisabled();

  await decrease().click();
  await decrease().click();

  await expect.element(input()).toHaveValue("5");
  await expect.element(decrease()).toBeDisabled();
});

/*
 * The number field parses on commit, not on every keystroke – the value is what
 * leaving the field reports, and out-of-range input is clamped there too.
 */
test("a typed value is committed on blur and clamped to the range", async () => {
  const onChange = vi.fn();
  renderField({ minValue: 0, maxValue: 100, onChange });

  await userEvent.click(input());
  await userEvent.fill(input(), "42");
  await userEvent.tab();

  await expect.element(input()).toHaveValue("42");
  expect(onChange).toHaveBeenLastCalledWith(42);

  await userEvent.fill(input(), "1000");
  await userEvent.tab();

  await expect.element(input()).toHaveValue("100");
  expect(onChange).toHaveBeenLastCalledWith(100);
});

test("a disabled number field cannot be stepped", async () => {
  const onChange = vi.fn();
  renderField({ defaultValue: 5, isDisabled: true, onChange });

  await expect.element(input()).toBeDisabled();
  await expect.element(increase()).toBeDisabled();

  await increase().click({ force: true });

  await expect.element(input()).toHaveValue("5");
  expect(onChange).not.toHaveBeenCalled();
});
