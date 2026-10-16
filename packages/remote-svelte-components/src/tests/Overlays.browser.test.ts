import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import SquadronLightBox from "./fixtures/SquadronLightBox.svelte";
import SquadronModal from "./fixtures/SquadronModal.svelte";
import SquadronPopover from "./fixtures/SquadronPopover.svelte";
import { cleanupRemote, hostOverlay, renderRemote } from "./lib/environment.js";

afterEach(() => cleanupRemote());

const dialog = () => page.getByRole("dialog");

describe("Modal", () => {
  test("opens from its trigger and renders the host's modal", async () => {
    renderRemote(SquadronModal);

    await page.getByRole("button", { name: "New squadron" }).click();

    await expect
      .element(page.getByRole("heading", { name: "New squadron" }))
      .toBeVisible();
    await expect.element(dialog()).toBeVisible();
  });

  /*
   * The classes are what make the host render a modal rather than a bare
   * dialog — `Modal` is a React composition on the host side, and this rebuild's
   * only way to ask for it. A rename there breaks this test before it breaks a
   * user's modal.
   */
  test("asks the host for the modal it was configured as", async () => {
    renderRemote(SquadronModal, { offCanvas: true, size: "l" });

    await page.getByRole("button", { name: "New squadron" }).click();
    await expect.element(dialog()).toBeVisible();

    expect(hostOverlay("flow--modal--off-canvas")).not.toBeNull();
    expect(hostOverlay("flow--modal--size-l")).not.toBeNull();
  });

  test("closes again through an Action", async () => {
    const onAction = vi.fn();

    renderRemote(SquadronModal, { onAction });

    await page.getByRole("button", { name: "New squadron" }).click();
    await expect.element(dialog()).toBeVisible();

    await page.getByRole("button", { name: "Create" }).click();

    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(1));
    await expect.element(dialog()).not.toBeInTheDocument();
  });

  /*
   * The trigger declares `onPress` for `Button` through the props context, and
   * the modal's own `OverlayContent` clears that context again — otherwise the
   * "Create" button inside would carry the trigger's open handler as well.
   */
  test("does not give the buttons inside the modal the trigger's handler", async () => {
    renderRemote(SquadronModal);

    await page.getByRole("button", { name: "New squadron" }).click();
    await expect.element(dialog()).toBeVisible();

    await page.getByRole("button", { name: "Create" }).click();

    await expect.element(dialog()).not.toBeInTheDocument();
  });
});

describe("Popover", () => {
  test("opens from its trigger and asks the host for a popover", async () => {
    renderRemote(SquadronPopover);

    await page.getByRole("button", { name: "Details" }).click();

    await expect
      .poll(() => hostOverlay("flow--popover"), { timeout: 5000 })
      .not.toBeNull();
  });
});

describe("LightBox", () => {
  test("opens from its trigger and asks the host for a light box", async () => {
    renderRemote(SquadronLightBox);

    await page.getByRole("button", { name: "Show" }).click();

    await expect
      .poll(() => hostOverlay("flow--light-box"), { timeout: 5000 })
      .not.toBeNull();
  });
});
