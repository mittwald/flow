import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { Button } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";

const trigger = () => page.getByRole("button", { name: "Copy coordinates" });
const tooltip = () => page.getByRole("tooltip");

const renderTrigger = (props?: { isDisabled?: boolean }) =>
  render(
    <>
      <span>Elsewhere</span>
      <TooltipTrigger {...props}>
        <Button aria-label="Copy coordinates">
          <IconCopy />
        </Button>
        <Tooltip>Copies the coordinates to the clipboard</Tooltip>
      </TooltipTrigger>
    </>,
  );

/*
 * react-aria only counts a hover as a hover while the interaction modality is
 * the pointer, and a freshly loaded page has no modality yet – the press
 * establishes it.
 */
const useThePointer = () => page.getByText("Elsewhere").click();

test("keyboard focus shows the tooltip and blur hides it again", async () => {
  renderTrigger();

  await expect.element(tooltip()).not.toBeInTheDocument();

  await userEvent.tab();

  await expect.element(tooltip()).toBeVisible();

  await userEvent.tab();

  await expect.element(tooltip()).not.toBeInTheDocument();
});

test("escape hides the tooltip while the trigger stays focused", async () => {
  renderTrigger();

  await userEvent.tab();
  await expect.element(tooltip()).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(tooltip()).not.toBeInTheDocument();
  await expect.element(trigger()).toHaveFocus();
});

// The tooltip describes the trigger; it does not name it.
test("the tooltip describes the trigger", async () => {
  renderTrigger();

  await userEvent.tab();
  await expect.element(tooltip()).toBeVisible();

  await expect
    .element(trigger())
    .toHaveAccessibleDescription("Copies the coordinates to the clipboard");
  await expect.element(trigger()).toHaveAccessibleName("Copy coordinates");
});

// The trigger waits out its 400ms hover delay before it opens.
test("hovering the trigger shows the tooltip and leaving hides it", async () => {
  renderTrigger();
  await useThePointer();

  await trigger().hover();

  await expect.element(tooltip(), { timeout: 3000 }).toBeVisible();

  await page.getByText("Elsewhere").hover();

  await expect.element(tooltip()).not.toBeInTheDocument();
});

test("a disabled trigger shows no tooltip", async () => {
  renderTrigger({ isDisabled: true });
  await useThePointer();

  await trigger().hover();
  await userEvent.tab();

  await expect.element(tooltip(), { timeout: 2000 }).not.toBeInTheDocument();
});
