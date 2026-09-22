import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Calendar } from "@/components/Calendar";

/*
 * react-aria renders a second, offscreen pair of nav buttons with the same
 * labels, so the header's own buttons are addressed by their slot.
 */
const previous = () => page.getByLocator("button[slot='previous']");
const next = () => page.getByLocator("button[slot='next']");

/*
 * react-aria hides the visible month title from assistive technology and names
 * the grid after it instead, so the grid's label is what the month actually is.
 */
const shownMonth = () =>
  document.querySelector("[role='grid']")?.getAttribute("aria-label");

/*
 * The header's two buttons are plain Flow buttons wired to react-aria through
 * `ariaSlot` – the only thing that makes them page the grid.
 */
test("the header buttons page through the months", async () => {
  await render(<Calendar />);
  await expect.element(page.getByRole("grid")).toBeVisible();

  const initial = shownMonth();
  expect(initial).toBeTruthy();

  await next().click();

  await expect.poll(shownMonth).not.toBe(initial);

  await previous().click();

  await expect.poll(shownMonth).toBe(initial);

  await previous().click();

  await expect.poll(shownMonth).not.toBe(initial);
});

test("the grid marks today", async () => {
  await render(<Calendar />);

  await expect.element(page.getByRole("grid")).toBeVisible();
  await expect
    .element(page.getByRole("button", { name: /^Today/ }))
    .toBeInTheDocument();
});
