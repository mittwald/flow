import { describe, expect, test } from "vitest";
import { createOverlayController } from "./overlayController.svelte.js";

describe("OverlayController", () => {
  test("starts closed", () => {
    expect(createOverlayController().isOpen).toBe(false);
  });

  test("starts open when told to", () => {
    expect(createOverlayController({ isDefaultOpen: true }).isOpen).toBe(true);
  });

  test("opens, closes and toggles", () => {
    const controller = createOverlayController();

    controller.open();
    expect(controller.isOpen).toBe(true);

    controller.close();
    expect(controller.isOpen).toBe(false);

    controller.toggle();
    expect(controller.isOpen).toBe(true);
  });

  /*
   * The methods are handed to a `DialogTrigger` as `onOpenChange`, so they are
   * called detached from the controller. Bound fields, not prototype methods.
   */
  test("keeps working when its methods are passed on alone", () => {
    const controller = createOverlayController();
    const { setOpen } = controller;

    setOpen(true);
    expect(controller.isOpen).toBe(true);
  });
});
