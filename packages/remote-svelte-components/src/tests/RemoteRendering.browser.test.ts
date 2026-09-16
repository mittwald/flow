import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import DangerButton from "./fixtures/DangerButton.svelte";
import DashedProps from "./fixtures/DashedProps.svelte";
import Greeting from "./fixtures/Greeting.svelte";
import PressButton from "./fixtures/PressButton.svelte";
import SlottedProgressBar from "./fixtures/SlottedProgressBar.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

afterEach(() => cleanupRemote());

describe("A Svelte tree rendered through the host renderer", () => {
  test("renders a Flow component the host materializes", async () => {
    renderRemote(Greeting);

    await expect
      .element(page.getByRole("heading", { name: "Hello Svelte" }))
      .toBeVisible();
  });

  test("passes props through as remote properties", async () => {
    renderRemote(DangerButton);

    await expect
      .element(page.getByRole("button", { name: "Delete" }))
      .toBeDisabled();
  });

  /*
   * Flow declares plenty of dashed props — `aria-label`, `data-testid`,
   * `aria-describedby`. A binding that camelizes prop names to suit its own
   * conventions loses them: `data-testid` becomes `dataTestid`, which the
   * element does not know, and the value never leaves the remote side.
   * `aria-*` hides the bug, because the DOM reflects `ariaLabel` back onto the
   * attribute.
   *
   * Svelte passes a component's props through untouched, so this holds by
   * construction — and the test is what keeps a well-meant normalization out.
   */
  test("passes a prop the element declares with dashes through as written", async () => {
    renderRemote(DashedProps);

    await expect
      .element(page.getByTestId("fire"))
      .toHaveAttribute("aria-label", "Fire proton torpedo");
  });

  test("delivers a host event to the Svelte listener", async () => {
    const onPress = vi.fn();

    renderRemote(PressButton, { onPress });

    await page.getByRole("button", { name: "Press me" }).click();

    await vi.waitFor(() => expect(onPress).toHaveBeenCalledTimes(1));
  });

  /*
   * A `ReactNode`-typed prop is a snippet here, and it travels as a slotted
   * child (`flr-slot-root-wrapper slot="valueLabel"`) rather than as a remote
   * property — rendered output does not survive structured clone.
   */
  test("renders a snippet passed for a slot prop", async () => {
    const { host } = renderRemote(SlottedProgressBar);

    await expect
      .poll(() => host.textContent, { timeout: 5000 })
      .toContain("Almost there");
  });
});
