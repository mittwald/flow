import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { MenuItem } from "@/components/MenuItem";
import { PropsContextProvider } from "@/lib/propsContext";

test("a Separator props context reaches the separator", async () => {
  await render(
    <PropsContextProvider props={{ Separator: { className: "from-context" } }}>
      <Separator />
    </PropsContextProvider>,
  );

  await expect.element(page.getByRole("separator")).toHaveClass("from-context");
});

/* react-aria renders collection children twice (#3146). */
test("a separator in a ContextMenu renders once and is skipped by the keyboard", async () => {
  await render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu>
        <MenuItem id="1">Item 1</MenuItem>
        <Separator />
        <MenuItem id="2">Item 2</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>,
  );

  (page.getByRole("button").element() as HTMLElement).focus();
  await userEvent.keyboard("{Enter}");
  const menu = page.getByRole("menu");
  await expect.element(menu.getByRole("menuitem").first()).toHaveFocus();

  expect(menu.getByRole("separator").elements()).toHaveLength(1);

  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(menu.getByRole("menuitem", { name: "Item 2" }))
    .toHaveFocus();

  await userEvent.keyboard("{ArrowUp}");
  await expect
    .element(menu.getByRole("menuitem", { name: "Item 1" }))
    .toHaveFocus();
});
