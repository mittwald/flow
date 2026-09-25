import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Radio, RadioGroup } from "@/components/RadioGroup";
import { Label } from "@/components/Label";

const radio = (name: string) => page.getByRole("radio", { name });

/*
 * The radio icon is stacked on top of the visually hidden input, so a click has
 * to go to the label text – on the input itself playwright refuses with
 * "intercepts pointer events".
 */
const pick = (name: string) => page.getByText(name, { exact: true });

const renderGroup = (props?: {
  defaultValue?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
}) =>
  render(
    <RadioGroup {...props}>
      <Label>Rank</Label>
      <Radio value="master">Jedi Master</Radio>
      <Radio value="knight">Jedi Knight</Radio>
      <Radio value="padawan">Padawan</Radio>
    </RadioGroup>,
  );

test("selecting a radio reports its value and deselects the previous one", async () => {
  const onChange = vi.fn();
  renderGroup({ onChange });

  await pick("Jedi Knight").click();

  await expect.element(radio("Jedi Knight")).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("knight");

  await pick("Padawan").click();

  await expect.element(radio("Jedi Knight")).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("padawan");
});

/*
 * A radio group is one tab stop: the arrow keys move within it and select as
 * they go.
 */
test("the arrow keys move the selection within the group", async () => {
  const onChange = vi.fn();
  renderGroup({ onChange });

  await pick("Jedi Master").click();
  await userEvent.keyboard("{ArrowDown}");

  await expect.element(radio("Jedi Knight")).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("knight");

  await userEvent.keyboard("{ArrowUp}");

  await expect.element(radio("Jedi Master")).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("master");
});

test("a single disabled radio cannot be selected while the others can", async () => {
  const onChange = vi.fn();

  render(
    <RadioGroup onChange={onChange}>
      <Label>Rank</Label>
      <Radio value="master" isDisabled>
        Jedi Master
      </Radio>
      <Radio value="knight">Jedi Knight</Radio>
    </RadioGroup>,
  );

  await expect.element(radio("Jedi Master")).toBeDisabled();

  await pick("Jedi Master").click({ force: true });

  expect(onChange).not.toHaveBeenCalled();

  await pick("Jedi Knight").click();

  expect(onChange).toHaveBeenLastCalledWith("knight");
});

test("a disabled group disables every radio", async () => {
  renderGroup({ isDisabled: true });

  await expect.element(radio("Jedi Master")).toBeDisabled();
  await expect.element(radio("Padawan")).toBeDisabled();
});

test("a read-only group keeps its value", async () => {
  const onChange = vi.fn();
  renderGroup({ isReadOnly: true, defaultValue: "master", onChange });

  await pick("Padawan").click();

  await expect.element(radio("Jedi Master")).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});
