import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Checkbox } from "@/components/Checkbox";
import { CheckboxButton } from "@/components/CheckboxButton";
import { Label } from "@/components/Label";

const checkbox = (name: string) => page.getByRole("checkbox", { name });

/*
 * The checkbox icons are stacked on top of the visually hidden input, so a
 * click has to go to the label text – on the input itself playwright refuses
 * with "intercepts pointer events".
 */
const check = (name: string) => page.getByText(name, { exact: true });

const renderGroup = (props?: {
  defaultValue?: string[];
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (value: string[]) => void;
}) =>
  render(
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <Checkbox value="write">Write</Checkbox>
    </CheckboxGroup>,
  );

test("the group reports the values of every selected checkbox", async () => {
  const onChange = vi.fn();
  renderGroup({ onChange });

  await check("Read").click();

  expect(onChange).toHaveBeenLastCalledWith(["read"]);

  await check("Write").click();

  expect(onChange).toHaveBeenLastCalledWith(["read", "write"]);

  await check("Read").click();

  expect(onChange).toHaveBeenLastCalledWith(["write"]);
});

test("defaultValue preselects the matching checkboxes", async () => {
  renderGroup({ defaultValue: ["write"] });

  await expect.element(checkbox("Read")).not.toBeChecked();
  await expect.element(checkbox("Write")).toBeChecked();
});

test("a disabled group disables every checkbox", async () => {
  renderGroup({ isDisabled: true });

  await expect.element(checkbox("Read")).toBeDisabled();
  await expect.element(checkbox("Write")).toBeDisabled();
});

test("a read-only group keeps its value", async () => {
  const onChange = vi.fn();
  renderGroup({ isReadOnly: true, defaultValue: ["read"], onChange });

  await check("Write").click();

  await expect.element(checkbox("Write")).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

/*
 * `Checkbox` and `CheckboxButton` are tunnelled into two separate layouts, but
 * both belong to the same selection.
 */
test("checkboxes and checkbox buttons share one selection", async () => {
  const onChange = vi.fn();

  render(
    <CheckboxGroup onChange={onChange}>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <CheckboxButton value="write">Write</CheckboxButton>
    </CheckboxGroup>,
  );

  await check("Read").click();
  await check("Write").click();

  expect(onChange).toHaveBeenLastCalledWith(["read", "write"]);
});
