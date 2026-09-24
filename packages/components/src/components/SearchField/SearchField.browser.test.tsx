import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { SearchField } from "@/components/SearchField";
import { Label } from "@/components/Label";

const searchBox = () => page.getByRole("searchbox");
const clearButton = () => page.getByRole("button", { name: "Clear search" });

const renderField = (props?: {
  defaultValue?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
}) =>
  render(
    <SearchField {...props}>
      <Label>Domain</Label>
    </SearchField>,
  );

test("typing reports every keystroke", async () => {
  const onChange = vi.fn();
  renderField({ onChange });

  await userEvent.fill(searchBox(), "rebelbase");

  await expect.element(searchBox()).toHaveValue("rebelbase");
  expect(onChange).toHaveBeenLastCalledWith("rebelbase");
});

test("the clear button empties the field", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();
  renderField({ defaultValue: "rebelbase", onChange, onClear });

  await clearButton().click();

  await expect.element(searchBox()).toHaveValue("");
  expect(onChange).toHaveBeenLastCalledWith("");
  expect(onClear).toHaveBeenCalled();
});

test("escape clears the field", async () => {
  renderField({ defaultValue: "rebelbase" });

  await userEvent.click(searchBox());
  await userEvent.keyboard("{Escape}");

  await expect.element(searchBox()).toHaveValue("");
});

test("enter submits the current value", async () => {
  const onSubmit = vi.fn();
  renderField({ onSubmit });

  await userEvent.fill(searchBox(), "tatooine");
  await userEvent.keyboard("{Enter}");

  expect(onSubmit).toHaveBeenCalledWith("tatooine");
});

test("a disabled search field cannot be typed into or cleared", async () => {
  const onChange = vi.fn();
  renderField({ defaultValue: "rebelbase", isDisabled: true, onChange });

  await expect.element(searchBox()).toBeDisabled();

  await clearButton().click({ force: true });

  await expect.element(searchBox()).toHaveValue("rebelbase");
  expect(onChange).not.toHaveBeenCalled();
});
