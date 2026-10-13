import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { ComboBox } from "@/components/ComboBox";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { testFormFieldContract } from "@/tests/formFieldContract/testFormFieldContract";

/*
 * react-aria hands the options popover its `isNonModal` through context, not
 * through props — the ComboBox sets it so the user can keep typing. A Popover
 * that passes react-aria an explicit `isNonModal={false}` overrides that and
 * turns the option list into a modal that locks the page.
 */
test("The options of a combo box do not lock the page", async () => {
  render(
    <ComboBox>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>tatooine.com</Option>
    </ComboBox>,
  );

  const overflowBefore = document.documentElement.style.overflow;

  await page.getByRole("combobox").click();

  await expect.element(page.getByRole("listbox")).toBeVisible();
  // Assert the delta: a modal popover would set it to "hidden".
  expect(document.documentElement.style.overflow).toBe(overflowBefore);
});

test("onOpenChange reports opening with its trigger and an Escape close without suppressing it", async () => {
  const onOpenChange = vi.fn();
  render(
    <ComboBox onOpenChange={onOpenChange}>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>tatooine.com</Option>
    </ComboBox>,
  );

  await page.getByRole("combobox").click();
  await expect.element(page.getByRole("listbox")).toBeVisible();
  expect(onOpenChange).toHaveBeenLastCalledWith(true, "focus");

  await userEvent.keyboard("{Escape}");
  await expect.element(page.getByRole("listbox")).not.toBeInTheDocument();
  expect(onOpenChange.mock.lastCall?.[0]).toBe(false);
});

test("onOpenChange reports the close after picking an option", async () => {
  const onOpenChange = vi.fn();
  render(
    <ComboBox onOpenChange={onOpenChange}>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>tatooine.com</Option>
    </ComboBox>,
  );

  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "tatooine.com" }).click();

  await expect.element(page.getByRole("listbox")).not.toBeInTheDocument();
  expect(onOpenChange.mock.lastCall?.[0]).toBe(false);
});

testFormFieldContract("ComboBox", {
  render: (props) => (
    <ComboBox {...props}>
      {props.children}
      <Option value="rebelbase">rebelbase.org</Option>
      <Option value="tatooine">tatooine.com</Option>
    </ComboBox>
  ),
  getControl: (screen) => screen.getByRole("combobox"),
  values: ["rebelbase", "tatooine"],
  toFormValue: (value) => value,
  // Keyboard only: a click on an option would wait for a list that a disabled
  // or read-only combo box never opens.
  changeValue: async (screen, { force }) => {
    await userEvent.fill(screen.getByRole("combobox"), "tatooine", { force });
    await userEvent.keyboard("{ArrowDown}{Enter}");
  },
});
