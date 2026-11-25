import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { ItemAction } from "@/components/ItemAction";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { IconDelete } from "@/components/Icon/components/icons";

const item = () => page.getByRole("menuitem", { name: /Chat 1/ });
const action = () => page.getByRole("button", { name: "Delete chat 1" });

const openMenu = async () => {
  const onAction = vi.fn();
  const onPress = vi.fn();

  render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu onAction={onAction}>
        <MenuItem id="chat1">
          <Text>Chat 1</Text>
          <ItemAction aria-label="Delete chat 1" onPress={onPress}>
            <IconDelete />
          </ItemAction>
        </MenuItem>
        <MenuItem id="chat2">
          <Text>Chat 2</Text>
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>,
  );

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect.element(page.getByRole("menu")).toBeVisible();

  return { onAction, onPress };
};

test("pressing the action does not run the item's action or close the menu", async () => {
  const { onAction, onPress } = await openMenu();

  await item().hover();
  await action().click();

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onAction).not.toHaveBeenCalled();
  await expect.element(page.getByRole("menu")).toBeVisible();
});

test("ArrowRight focuses the action, ArrowLeft returns to the item", async () => {
  const { onAction, onPress } = await openMenu();

  await userEvent.keyboard("{ArrowDown}");
  await expect.element(item()).toHaveFocus();

  await userEvent.keyboard("{ArrowRight}");
  await expect.element(action()).toHaveFocus();

  await userEvent.keyboard("{Enter}");
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onAction).not.toHaveBeenCalled();

  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(item()).toHaveFocus();
});

test("ArrowDown from the action moves to the next item", async () => {
  await openMenu();

  await userEvent.keyboard("{ArrowDown}");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(action()).toHaveFocus();

  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(page.getByRole("menuitem", { name: "Chat 2" }))
    .toHaveFocus();
});
