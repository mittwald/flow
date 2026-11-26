import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";

/*
 * `Action` hands `onPress` to its button through a props context that it sets
 * in the remote tree. `TooltipTrigger` must pass that context on: without
 * `@flr-provider` its remote element clears it, and the press does nothing.
 */
test.each(testEnvironments)(
  "an Action around a TooltipTrigger reaches the button (%s)",
  async ({
    render,
    components: { Action, Button, Tooltip, TooltipTrigger },
  }) => {
    const onAction = vi.fn();

    await render(
      <Action onAction={onAction}>
        <TooltipTrigger>
          <Button>Copy</Button>
          <Tooltip>Copies the coordinates</Tooltip>
        </TooltipTrigger>
      </Action>,
    );

    await page.getByRole("button", { name: "Copy" }).click();

    await expect.poll(() => onAction).toHaveBeenCalledOnce();
  },
);
