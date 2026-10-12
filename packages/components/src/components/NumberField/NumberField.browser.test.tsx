import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { NumberField } from "@/components/NumberField";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";

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

/*
 * React-aria cannot parse a unit Intl.NumberFormat does not know, so a custom
 * unit stays out of the input value. The field's name carries it instead, like
 * a unit written into the label.
 */
test("a custom unit is shown behind the number and named with the field", async () => {
  const onChange = vi.fn();
  await render(
    <NumberField unit="MiB" defaultValue={512} onChange={onChange}>
      <Label>Age</Label>
      <FieldDescription>Per project</FieldDescription>
    </NumberField>,
  );

  const field = page.getByRole("textbox", {
    name: "Age (optional) MiB",
    exact: true,
  });

  await expect.element(page.getByText("MiB")).toBeVisible();
  await expect.element(field).toHaveValue("512");
  await expect.element(field).toHaveAccessibleDescription("Per project");

  await userEvent.fill(field, "1024");
  await userEvent.tab();

  expect(onChange).toHaveBeenLastCalledWith(1024);
});

test("a custom unit is hidden but named while the field is empty", async () => {
  await render(
    <NumberField unit="MiB">
      <Label>Age</Label>
    </NumberField>,
  );

  const field = page.getByRole("textbox", {
    name: "Age (optional) MiB",
    exact: true,
  });

  await expect.element(page.getByText("MiB")).not.toBeVisible();
  await expect.element(field).toBeInTheDocument();

  await userEvent.fill(field, "3");

  await expect.element(page.getByText("MiB")).toBeVisible();
});

test("a custom unit extends an aria-label", async () => {
  await render(<NumberField unit="MiB" aria-label="Age" />);

  await expect
    .element(page.getByRole("textbox", { name: "Age MiB", exact: true }))
    .toBeInTheDocument();
});
