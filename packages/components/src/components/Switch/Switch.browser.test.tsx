import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Switch } from "@/components/Switch";
import { Label } from "@/components/Label";

const toggle = () => page.getByRole("switch");
const label = () => page.getByText("Hyperdrive");

test("clicking the label toggles the switch and reports the new state", async () => {
  const onChange = vi.fn();

  render(
    <Switch onChange={onChange}>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await expect.element(toggle()).not.toBeChecked();

  await label().click();

  await expect.element(toggle()).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(true);

  await label().click();

  await expect.element(toggle()).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(false);
});

test("the space key toggles the focused switch", async () => {
  render(
    <Switch>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await userEvent.tab();
  await userEvent.keyboard(" ");

  await expect.element(toggle()).toBeChecked();
});

test("defaultSelected starts the switch on", async () => {
  render(
    <Switch defaultSelected>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await expect.element(toggle()).toBeChecked();
});

test("a disabled switch does not toggle", async () => {
  const onChange = vi.fn();

  render(
    <Switch isDisabled onChange={onChange}>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await expect.element(toggle()).toBeDisabled();

  await label().click({ force: true });

  await expect.element(toggle()).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test("a read-only switch keeps its state", async () => {
  const onChange = vi.fn();

  render(
    <Switch isReadOnly defaultSelected onChange={onChange}>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await label().click();

  await expect.element(toggle()).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

/*
 * The switch renders react-aria's state, not the input's – a controlled switch
 * whose handler ignores the change has to stay where its prop puts it.
 */
test("a controlled switch follows its prop, not the click", async () => {
  const onChange = vi.fn();

  render(
    <Switch isSelected={false} onChange={onChange}>
      <Label>Hyperdrive</Label>
    </Switch>,
  );

  await label().click();

  expect(onChange).toHaveBeenCalledWith(true);
  await expect.element(toggle()).not.toBeChecked();
});
