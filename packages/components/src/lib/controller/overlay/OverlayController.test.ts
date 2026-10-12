import { describe, expect, test, vitest } from "vitest";
import { OverlayController } from "@/lib/controller/overlay/OverlayController";

describe("setOpen", () => {
  test("a handler that applies the same state again does not recurse", () => {
    const controller = new OverlayController({ isDefaultOpen: true });
    const handler = vitest.fn(() => controller.setOpen(false));
    controller.addOnOpenChange(handler);

    controller.close();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(controller.isOpen).toBe(false);
  });

  test("the guard is lifted again once the change has been applied", () => {
    const controller = new OverlayController({ isDefaultOpen: true });
    const handler = vitest.fn(() => controller.setOpen(false));
    controller.addOnOpenChange(handler);

    controller.close();
    controller.open();
    controller.close();

    expect(controller.isOpen).toBe(false);
    expect(handler).toHaveBeenCalledTimes(3);
  });

  test("a handler still aborts the change by returning false", () => {
    const controller = new OverlayController({ isDefaultOpen: true });
    controller.addOnClose(() => false);

    controller.close();

    expect(controller.isOpen).toBe(true);
  });
});

describe("syncOpen", () => {
  test("sets the open state without running any handler", () => {
    const controller = new OverlayController();
    const onOpen = vitest.fn();
    const onOpenChange = vitest.fn();
    controller.addOnOpen(onOpen);
    controller.addOnOpenChange(onOpenChange);

    controller.syncOpen(true);

    expect(controller.isOpen).toBe(true);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("bypasses the close confirmation", () => {
    const controller = new OverlayController({
      isDefaultOpen: true,
      confirmOnClose: true,
    });

    controller.syncOpen(false);

    expect(controller.isOpen).toBe(false);
    expect(controller.showConfirmationModal).toBe(false);
  });
});
