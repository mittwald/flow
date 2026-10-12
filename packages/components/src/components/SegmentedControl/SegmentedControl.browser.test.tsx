import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Segment } from "@/components/SegmentedControl/components/Segment";
import { Label } from "@/components/Label";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

const option = (name: string) => page.getByRole("radio", { name });

// The checkmark icon covers the hidden input, so clicks go to the label text.
const pick = (name: string) => page.getByText(name, { exact: true });

const renderControl = (props?: {
  defaultValue?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (value: string) => void;
}) =>
  render(
    <SegmentedControl {...props}>
      <Label>View</Label>
      <Segment value="list">List</Segment>
      <Segment value="grid">Grid</Segment>
    </SegmentedControl>,
  );

test("the segments are one radio group and picking one reports its value", async () => {
  const onChange = vi.fn();
  renderControl({ defaultValue: "list", onChange });

  await expect.element(option("List")).toBeChecked();

  await pick("Grid").click();

  await expect.element(option("Grid")).toBeChecked();
  await expect.element(option("List")).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("grid");
});

test("the arrow keys move between the segments", async () => {
  const onChange = vi.fn();
  renderControl({ defaultValue: "list", onChange });

  await pick("List").click();
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(option("Grid")).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("grid");
});

test("a read-only control keeps its value", async () => {
  const onChange = vi.fn();
  renderControl({ isReadOnly: true, defaultValue: "list", onChange });

  await pick("Grid").click();

  await expect.element(option("List")).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test("a disabled control disables every segment", async () => {
  renderControl({ isDisabled: true });

  await expect.element(option("List")).toBeDisabled();
  await expect.element(option("Grid")).toBeDisabled();
});

/*
 * The component is deprecated and says so once per message – the warning is
 * the migration path extension developers get, so it is part of the contract.
 */
test("rendering the control warns that it is deprecated", async () => {
  const onWarning = vi.fn();

  render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <SegmentedControl>
        <Label>View</Label>
        <Segment value="list">List</Segment>
      </SegmentedControl>
    </DeprecationWarningProvider>,
  );

  await expect
    .poll(() => onWarning.mock.calls.flat().join("\n"))
    .toContain("'SegmentedControl' component is deprecated");
});
