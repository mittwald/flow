import {
  createOverlayController,
  createOverlayControllerFor,
} from "@/overlays/overlayController";
import { describe, expect, test } from "vitest";
import { ref } from "vue";

describe("createOverlayController", () => {
  test("starts closed", () => {
    expect(createOverlayController().isOpen.value).toBe(false);
  });

  test("starts open when asked to", () => {
    expect(createOverlayController({ isDefaultOpen: true }).isOpen.value).toBe(
      true,
    );
  });

  test("opens, closes and toggles", () => {
    const controller = createOverlayController();

    controller.open();
    expect(controller.isOpen.value).toBe(true);

    controller.close();
    expect(controller.isOpen.value).toBe(false);

    controller.toggle();
    expect(controller.isOpen.value).toBe(true);
  });

  /*
   * The host reports both directions through one handler — Escape and a click
   * outside arrive as `openChange(false)` — so `setOpen` has to take the value
   * rather than assume a direction.
   */
  test("takes the state the host reports", () => {
    const controller = createOverlayController({ isDefaultOpen: true });

    controller.setOpen(false);
    expect(controller.isOpen.value).toBe(false);

    controller.setOpen(true);
    expect(controller.isOpen.value).toBe(true);
  });
});

/*
 * `confirmOnClose` lives on the controller rather than on the `Modal`, because
 * every way out arrives here: an `Action` inside, the host's dismiss, or an app
 * that holds the controller itself.
 */
describe("confirmOnClose", () => {
  const openConfirming = () => {
    const controller = createOverlayController({ isDefaultOpen: true });
    controller.confirmOnClose.value = true;
    return controller;
  };

  test("asks instead of closing", () => {
    const controller = openConfirming();

    controller.requestClose();

    expect(controller.isConfirmingClose.value).toBe(true);
    expect(controller.isOpen.value).toBe(true);
  });

  test("closes once the confirmation is accepted", () => {
    const controller = openConfirming();

    controller.requestClose();
    controller.confirmClose();

    expect(controller.isOpen.value).toBe(false);
    expect(controller.isConfirmingClose.value).toBe(false);
  });

  test("stays open once the confirmation is declined", () => {
    const controller = openConfirming();

    controller.requestClose();
    controller.cancelClose();

    expect(controller.isOpen.value).toBe(true);
    expect(controller.isConfirmingClose.value).toBe(false);
  });

  /*
   * The host reports a dismiss as `openChange(false)`, which is a close like
   * any other — otherwise Escape is the way around the protection.
   */
  test("asks when the host reports a dismiss", () => {
    const controller = openConfirming();

    controller.setOpen(false);

    expect(controller.isConfirmingClose.value).toBe(true);
    expect(controller.isOpen.value).toBe(true);
  });

  /*
   * `close()` is the bypass an `Action` in the modal's footer gets: the
   * deliberate way out does not ask again.
   */
  test("closes without asking when told to close outright", () => {
    const controller = openConfirming();

    controller.close();

    expect(controller.isOpen.value).toBe(false);
  });

  test("does not ask while it is already closed", () => {
    const controller = createOverlayController();
    controller.confirmOnClose.value = true;

    controller.requestClose();

    expect(controller.isConfirmingClose.value).toBe(false);
  });
});

/*
 * How the confirmation modal is bound to its parent: it is an overlay whose
 * `isOpen` *is* the parent's `isConfirmingClose`, so dismissing it and
 * answering "keep editing" are the same event.
 */
describe("createOverlayControllerFor", () => {
  test("drives the state it was given", () => {
    const isConfirming = ref(false);
    const controller = createOverlayControllerFor(isConfirming);

    controller.open();
    expect(isConfirming.value).toBe(true);

    isConfirming.value = false;
    expect(controller.isOpen.value).toBe(false);
  });
});
