import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { MenuItem } from "@/components/MenuItem";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";

const item = () => page.getByRole("menuitem", { name: "Delete project" });

const openMenu = async (itemProps?: Record<string, unknown>) => {
  render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu>
        <MenuItem {...itemProps}>Delete project</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>,
  );

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect.element(item()).toBeVisible();
};

test("pressing an item reports the press", async () => {
  const onPress = vi.fn();
  await openMenu({ onPress });

  await item().click();

  expect(onPress).toHaveBeenCalledTimes(1);
});

/*
 * While an item is pending, succeeded or failed it must not run its action
 * again – the press handlers are stripped rather than the item disabled, so it
 * stays focusable and keeps announcing its state.
 */
test.each(["isPending", "isSucceeded", "isFailed", "aria-disabled"])(
  "an item marked %s does not run its action",
  async (state) => {
    const onPress = vi.fn();
    await openMenu({ onPress, [state]: true });

    await item().click({ force: true });

    expect(onPress).not.toHaveBeenCalled();
  },
);

/*
 * react-aria drops `aria-current` before it reaches the DOM, so the current
 * item is marked with a data attribute instead.
 */
test("aria-current marks the item as current", async () => {
  await openMenu({ "aria-current": "page" });

  await expect.element(item()).toHaveAttribute("data-current", "true");
});

test("an explicit aria-current of false does not mark the item", async () => {
  await openMenu({ "aria-current": "false" });

  await expect.element(item()).not.toHaveAttribute("data-current");
});
