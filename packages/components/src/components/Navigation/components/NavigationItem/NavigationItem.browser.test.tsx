import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import { ItemAction } from "@/components/ItemAction";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";

const renderNavigation = (onPress = vi.fn(), onLinkPress = vi.fn()) =>
  render(
    <Navigation aria-label="Factions">
      <Link href="#jedi" onPress={onLinkPress}>
        Jedi Order
        <ItemAction aria-label="Pin Jedi Order" onPress={onPress}>
          Pin
        </ItemAction>
      </Link>
      <NavigationGroup>
        <Label>Others</Label>
        <Link href="#rebels">
          Rebel Alliance
          <ItemAction aria-label="Pin Rebel Alliance">Pin</ItemAction>
        </Link>
      </NavigationGroup>
    </Navigation>,
  );

test("the action follows the link inside the list item, not inside the link", async () => {
  await renderNavigation();

  for (const name of ["Pin Jedi Order", "Pin Rebel Alliance"]) {
    // `visibility="hover"` hides the action from the accessibility tree.
    const action = page
      .getByRole("button", { name, includeHidden: true })
      .element();
    const item = action.closest("li");
    expect(action.closest("a")).toBeNull();
    expect(item?.firstElementChild?.tagName).toBe("A");
    expect(item?.contains(action)).toBe(true);
  }
});

test("pressing the action does not press the link", async () => {
  const onPress = vi.fn();
  const onLinkPress = vi.fn();
  await renderNavigation(onPress, onLinkPress);

  await page.getByRole("link", { name: "Jedi Order" }).hover();
  await page.getByRole("button", { name: "Pin Jedi Order" }).click();

  expect(onPress).toHaveBeenCalledOnce();
  expect(onLinkPress).not.toHaveBeenCalled();
});

test("Tab reaches the action of the focused link before the next link", async () => {
  await renderNavigation();

  await userEvent.tab();
  await expect
    .element(page.getByRole("link", { name: "Jedi Order" }))
    .toHaveFocus();

  await userEvent.tab();
  await expect
    .element(page.getByRole("button", { name: "Pin Jedi Order" }))
    .toHaveFocus();

  await userEvent.tab();
  await expect
    .element(page.getByRole("link", { name: "Rebel Alliance" }))
    .toHaveFocus();
});
