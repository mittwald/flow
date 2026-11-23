import { testEnvironments } from "@/tests/lib/environments";
import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

/*
 * A scenario starts in a focused frame with the focus on the root container.
 * Otherwise `Tab` can go to the parent page or start where the previous
 * scenario's focused element was removed, and react-aria keeps the pointer
 * modality, so a tooltip does not open on keyboard focus.
 */
test.each(testEnvironments)(
  "Tab focuses the first element and shows its tooltip (%s)",
  async ({ render, components: { Button, Tooltip, TooltipTrigger } }) => {
    await render(
      <TooltipTrigger>
        <Button>Copy</Button>
        <Tooltip>Copies the coordinates</Tooltip>
      </TooltipTrigger>,
    );

    expect(document.hasFocus()).toBe(true);
    expect(document.activeElement).toBe(rootContainerLocator.element());

    const button = page.getByRole("button", { name: "Copy" });
    await expect.element(button).toBeVisible();

    await userEvent.tab();

    await expect.element(button).toHaveFocus();
    await expect.element(page.getByRole("tooltip")).toBeVisible();
  },
);
