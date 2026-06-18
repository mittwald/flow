import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import ContextMenu from "./ContextMenu";
import MenuItem from "../MenuItem";
import { usePromise } from "@mittwald/react-use-promise";
import { sleep } from "@/lib/promises/sleep";
import { Button, ContextMenuTrigger } from "../public";

const expectIconInDom = (iconName: string) => {
  expect(
    page.getByRole("img", {
      includeHidden: true,
    }),
  ).toHaveClass(`tabler-icon-${iconName}`);
};

beforeEach(() => {
  vitest.useFakeTimers();
  vitest.resetAllMocks();
});

afterEach(() => {
  vitest.runOnlyPendingTimers();
  vitest.useRealTimers();
});

test("Loading spinner is shown in trigger if content suspends", async () => {
  const MenuItemWithSuspense = () => {
    usePromise(sleep, [2000], {
      loaderId: "Loading spinner is shown in trigger if content suspends",
    });
    return <MenuItem>Menu Item</MenuItem>;
  };

  const testUi = (
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu>
        <MenuItemWithSuspense />
      </ContextMenu>
    </ContextMenuTrigger>
  );

  const { rerender } = await render(testUi);

  const trigger = page.getByText("Open menu");
  const menuItem = page.getByText("Menu Item");

  await userEvent.click(trigger);
  await vitest.advanceTimersByTimeAsync(1500);
  await rerender(testUi);
  expectIconInDom("loader-2");
  expect(menuItem).not.toBeInTheDocument();

  await vitest.advanceTimersByTimeAsync(1500);
  await rerender(testUi);
  expect(menuItem).toBeInTheDocument();
});
