import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ComboBox } from "@/components/ComboBox";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";

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
