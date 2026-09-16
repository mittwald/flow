import { createOverlayController } from "@/overlays/overlayController";
import { describe, expect, test } from "vitest";

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
