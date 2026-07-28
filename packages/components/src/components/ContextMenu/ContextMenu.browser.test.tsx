import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import ContextMenu from "./ContextMenu";
import MenuItem from "@/components/MenuItem";
import { usePromise } from "@mittwald/react-use-promise";
import { sleep } from "@/lib/promises/sleep";
import { Button, ContextMenuTrigger } from "@/components/public";
import { duration } from "@/components/Action/models/ActionState";

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

  // The trigger only shows the spinner after the suspended menu content
  // registers via a Suspense-fallback effect (setIsContentSuspended) and the
  // pending-wait timer (duration.pending) has elapsed. Flush the suspend
  // registration first – without advancing the clock – so the pending timer is
  // scheduled at a known point, then advance past it. Advancing in a single
  // step races the fallback effect and makes the spinner assertion flaky.
  await vitest.advanceTimersByTimeAsync(0);
  await rerender(testUi);
  await vitest.advanceTimersByTimeAsync(duration.pending);
  await rerender(testUi);
  expectIconInDom("loader-2");
  expect(menuItem).not.toBeInTheDocument();

  await vitest.advanceTimersByTimeAsync(2000);
  await rerender(testUi);
  expect(menuItem).toBeInTheDocument();
});
