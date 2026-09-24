import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Checkbox } from "@/components/Checkbox";

const checkbox = () => page.getByRole("checkbox");
const label = () => page.getByText("Accept the terms");

test("clicking the checkbox toggles it and reports the new state", async () => {
  const onChange = vi.fn();

  render(<Checkbox onChange={onChange}>Accept the terms</Checkbox>);

  await expect.element(checkbox()).not.toBeChecked();

  await label().click();

  await expect.element(checkbox()).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(true);

  await label().click();

  await expect.element(checkbox()).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(false);
});

test("the space key toggles the focused checkbox", async () => {
  render(<Checkbox>Accept the terms</Checkbox>);

  await userEvent.tab();
  await userEvent.keyboard(" ");

  await expect.element(checkbox()).toBeChecked();
});

/*
 * Indeterminate is a display state on top of the selection, not a third value:
 * the checkbox reports `mixed` while it is unselected, and a click selects it –
 * `isIndeterminate` is controlled, so it keeps reporting `mixed` until the
 * owner drops the prop.
 */
test("an indeterminate checkbox reports mixed and selects on the next click", async () => {
  const onChange = vi.fn();

  render(
    <Checkbox isIndeterminate onChange={onChange}>
      Accept the terms
    </Checkbox>,
  );

  await expect.element(checkbox()).toBePartiallyChecked();

  await label().click();

  expect(onChange).toHaveBeenCalledWith(true);
  await expect
    .poll(() => document.querySelector<HTMLInputElement>("input")?.checked)
    .toBe(true);
});

test("a disabled checkbox does not toggle", async () => {
  const onChange = vi.fn();

  render(
    <Checkbox isDisabled onChange={onChange}>
      Accept the terms
    </Checkbox>,
  );

  await expect.element(checkbox()).toBeDisabled();

  await label().click({ force: true });

  await expect.element(checkbox()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test("a read-only checkbox keeps its state", async () => {
  const onChange = vi.fn();

  render(
    <Checkbox isReadOnly defaultSelected onChange={onChange}>
      Accept the terms
    </Checkbox>,
  );

  await label().click();

  await expect.element(checkbox()).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});
