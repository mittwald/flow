import { Badge } from "@/components/Badge";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { Select } from "@/components/Select";
import { Text } from "@/components/Text";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

/*
 * The shape of the Select Default story: one option whose children are text
 * plus a Badge, next to plain-text options. Its key used to fall back to
 * react-aria's render-order counter (`react-aria-1`), because neither
 * `textValue` nor `value` could be inferred from more than one child (#3028).
 */
const renderSelect = (props?: {
  defaultValue?: string;
  onChange?: (value: unknown) => void;
}) =>
  render(
    <Select defaultValue={props?.defaultValue} onChange={props?.onChange}>
      <Label>Starship</Label>
      <Option>
        Millennium Falcon <Badge>Latest</Badge>
      </Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
    </Select>,
  );

const toggle = page.getByRole("button", { name: "Starship" });

const openOptions = async () => {
  await toggle.click();
  await expect.element(page.getByRole("listbox")).toBeVisible();
};

const optionKeys = () =>
  Array.from(document.querySelectorAll("[role='option']")).map((option) =>
    option.getAttribute("data-key"),
  );

test("every option gets its text as its key, mixed children included", async () => {
  renderSelect();
  await openOptions();

  expect(optionKeys()).toEqual(["Millennium Falcon", "X-Wing", "TIE Fighter"]);
});

test("selecting an option with mixed children reports its text as the value", async () => {
  const onChange = vi.fn();
  renderSelect({ onChange });
  await openOptions();

  await page.getByRole("option", { name: /Millennium Falcon/ }).click();

  expect(onChange).toHaveBeenCalledWith("Millennium Falcon");
});

test("an option with mixed children can be targeted by defaultValue", async () => {
  renderSelect({ defaultValue: "Millennium Falcon" });

  await expect.element(toggle).toHaveTextContent("Millennium Falcon");
});

test("the inferred textValue leaves out the text of element children", async () => {
  renderSelect({ defaultValue: "Millennium Falcon" });

  await expect.element(toggle).not.toHaveTextContent("Latest");
});

/*
 * With no text among its children there is nothing to infer, so `value` stays
 * undefined and react-aria generates the key. That used to be silent — the only
 * console output was react-aria's warning about `textValue`, which says nothing
 * about the key becoming the option's form value.
 */
test("an option whose children carry no text of their own says so", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  render(
    <Select>
      <Label>Starship</Label>
      <Option>
        <Text>Millennium Falcon</Text>
      </Option>
    </Select>,
  );

  await expect
    .poll(() => error.mock.calls.flat().join("\n"))
    .toMatch(/Option.*no 'value'/s);

  error.mockRestore();
});

test("an explicit value silences the warning and wins over the children", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const onChange = vi.fn();

  const options: ReactNode = (
    <Option value="mf">
      Millennium Falcon <Badge>Latest</Badge>
    </Option>
  );

  render(
    <Select onChange={onChange}>
      <Label>Starship</Label>
      {options}
    </Select>,
  );

  await openOptions();
  expect(optionKeys()).toEqual(["mf"]);

  await page.getByRole("option", { name: /Millennium Falcon/ }).click();
  expect(onChange).toHaveBeenCalledWith("mf");
  expect(error.mock.calls.flat().join("\n")).not.toMatch(/Option.*no 'value'/s);

  error.mockRestore();
});

/*
 * Flow routes options through a tunnel, and react-aria renders collection
 * children twice — once into its hidden collection document, once for real.
 * With a generated tunnel entry id both renders registered their own entry, so
 * the exit rendered every option twice and the collection held two element
 * nodes per key. The keys stayed unique, but the `prevKey`/`nextKey` links
 * derived from that doubled sibling chain formed a ring: the first option's
 * `prevKey` pointed at the last one.
 *
 * Visible as a wrapping `ArrowUp`; the expensive half is that react-stately's
 * focus restoration walks `getKeyBefore` until it returns null, which in a ring
 * never happens and blocks the main thread for good (#3028 is about the keys
 * themselves, this is about the options being in the collection twice).
 */
const focusedOptionText = () =>
  document
    .querySelector("[role='option'][data-focused='true']")
    ?.textContent?.trim();

test("the option collection is a list, not a ring", async () => {
  renderSelect();
  await openOptions();

  await userEvent.keyboard("{Home}");
  await expect.poll(focusedOptionText).toMatch(/^Millennium Falcon/);

  // In a ring this lands on the last option instead of staying put.
  await userEvent.keyboard("{ArrowUp}");
  await expect.poll(focusedOptionText).toMatch(/^Millennium Falcon/);

  await userEvent.keyboard("{End}");
  await expect.poll(focusedOptionText).toBe("TIE Fighter");

  await userEvent.keyboard("{ArrowDown}");
  await expect.poll(focusedOptionText).toBe("TIE Fighter");
});
