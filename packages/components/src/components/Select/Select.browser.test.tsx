import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Select } from "@/components/Select";
import { Option } from "@/components/Option";
import { Label } from "@/components/Label";

const toggle = () => page.getByRole("button", { name: /Starship/ });
const listBox = () => page.getByRole("listbox");
const option = (name: string) => page.getByRole("option", { name });

const renderSelect = (props?: {
  isReadOnly?: boolean;
  isDisabled?: boolean;
  selectionMode?: "single" | "multiple";
  defaultValue?: string;
  onChange?: (value: unknown) => void;
}) =>
  render(
    <Select {...props}>
      <Label>Starship</Label>
      <Option>Millennium Falcon</Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
    </Select>,
  );

test("the keyboard opens the options and selects one", async () => {
  const onChange = vi.fn();
  renderSelect({ onChange });

  await userEvent.tab();
  await userEvent.keyboard("{Enter}");

  await expect.element(listBox()).toBeVisible();

  await userEvent.keyboard("{ArrowDown}{Enter}");

  await expect.element(listBox()).not.toBeInTheDocument();
  expect(onChange).toHaveBeenCalledWith("X-Wing");
});

/*
 * Read-only is not the same as disabled: the select stays focusable and keeps
 * showing its value, but neither opens nor changes.
 */
test("a read-only select does not open", async () => {
  const onChange = vi.fn();
  renderSelect({
    isReadOnly: true,
    defaultValue: "X-Wing",
    onChange,
  });

  await toggle().click();

  await expect.element(listBox()).not.toBeInTheDocument();
  await expect.element(toggle()).toHaveTextContent("X-Wing");
  expect(onChange).not.toHaveBeenCalled();
});

test("a disabled select does not open", async () => {
  renderSelect({ isDisabled: true });

  await expect.element(toggle()).toBeDisabled();

  await toggle().click({ force: true });

  await expect.element(listBox()).not.toBeInTheDocument();
});

test("multiple selection collects every picked option and stays open", async () => {
  const onChange = vi.fn();
  renderSelect({ selectionMode: "multiple", onChange });

  await toggle().click();

  await option("Millennium Falcon").click();
  await option("TIE Fighter").click();

  expect(onChange).toHaveBeenLastCalledWith([
    "Millennium Falcon",
    "TIE Fighter",
  ]);
});

test("escape closes the options without changing the value", async () => {
  const onChange = vi.fn();
  renderSelect({ defaultValue: "X-Wing", onChange });

  await toggle().click();
  await expect.element(listBox()).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(listBox()).not.toBeInTheDocument();
  await expect.element(toggle()).toHaveTextContent("X-Wing");
  expect(onChange).not.toHaveBeenCalled();
});
