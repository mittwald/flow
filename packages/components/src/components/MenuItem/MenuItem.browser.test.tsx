import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { MenuItem } from "@/components/MenuItem";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";

const item = () => page.getByRole("menuitem", { name: "Delete project" });

const openMenu = async (
  itemProps?: Record<string, unknown>,
  menuProps?: Record<string, unknown>,
) => {
  render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu {...menuProps}>
        <MenuItem id="delete" {...itemProps}>
          Delete project
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>,
  );

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect.element(page.getByRole("menu")).toBeVisible();
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
    const onAction = vi.fn();
    await openMenu({ onPress, onAction, [state]: true });
    await expect.element(item()).toHaveAttribute("aria-disabled", "true");

    await item().click({ force: true });

    expect(onPress).not.toHaveBeenCalled();
    expect(onAction).not.toHaveBeenCalled();
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

test("a muted item does not run the action of its menu", async () => {
  const onAction = vi.fn();
  await openMenu({ isPending: true }, { onAction });

  await item().click({ force: true });
  item().element().focus();
  await userEvent.keyboard("{Enter}");

  expect(onAction).not.toHaveBeenCalled();
});

test("a muted link item stays a link but does not navigate", async () => {
  location.hash = "";
  await openMenu({ href: "#projects", isPending: true });

  await expect.element(item()).toHaveAttribute("href", "#projects");
  await expect.element(item()).toHaveAttribute("aria-disabled", "true");

  await item().click({ force: true });

  expect(location.hash).toBe("");
});

test("a muted item cannot be selected", async () => {
  const onSelectionChange = vi.fn();
  await openMenu(
    { isPending: true },
    { selectionMode: "multiple", onSelectionChange },
  );
  const checkbox = page.getByRole("menuitemcheckbox", {
    name: "Delete project",
  });
  await expect.element(checkbox).toHaveAttribute("aria-disabled", "true");

  await checkbox.click({ force: true });
  checkbox.element().focus();
  await userEvent.keyboard(" ");
  await userEvent.keyboard("{Enter}");

  expect(onSelectionChange).not.toHaveBeenCalled();
  await expect.element(checkbox).toHaveAttribute("aria-checked", "false");
});

test("a muted item still moves focus with the arrow keys", async () => {
  render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu>
        <MenuItem isPending>Delete project</MenuItem>
        <MenuItem>Rename project</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>,
  );
  await page.getByRole("button", { name: "Open menu" }).click();
  item().element().focus();

  await userEvent.keyboard("{ArrowDown}");

  await expect
    .element(page.getByRole("menuitem", { name: "Rename project" }))
    .toHaveFocus();
});
