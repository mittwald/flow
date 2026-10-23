import { describe, expect, test, vitest } from "vitest";
import { OverlayState } from "./OverlayState";

describe("setOpen", () => {
  test("a handler that applies the same state again does not recurse", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    const handler = vitest.fn(() => state.setOpen(false));
    state.addOnOpenChange(handler);

    state.close();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(state.isOpen).toBe(false);
  });

  test("the guard is lifted again once the change has been applied", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    const handler = vitest.fn(() => state.setOpen(false));
    state.addOnOpenChange(handler);

    state.close();
    state.open();
    state.close();

    expect(state.isOpen).toBe(false);
    expect(handler).toHaveBeenCalledTimes(3);
  });

  test("a handler that opens again while opening does not recurse", () => {
    const state = new OverlayState();
    const onOpen = vitest.fn(() => state.setOpen(true));
    const onOpenChange = vitest.fn(() => state.open());
    state.addOnOpen(onOpen);
    state.addOnOpenChange(onOpenChange);

    state.open();

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(state.isOpen).toBe(true);
  });

  test("a handler returning false aborts open and close", () => {
    const state = new OverlayState();
    state.addOnOpen(() => false);

    state.open();
    expect(state.isOpen).toBe(false);

    state.syncOpen(true);
    state.addOnClose(() => false);
    state.close();
    expect(state.isOpen).toBe(true);
  });
});

describe("syncOpen", () => {
  test("sets the open state without running any handler", () => {
    const state = new OverlayState();
    const onOpen = vitest.fn();
    const onOpenChange = vitest.fn();
    state.addOnOpen(onOpen);
    state.addOnOpenChange(onOpenChange);

    state.syncOpen(true);

    expect(state.isOpen).toBe(true);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("bypasses the close confirmation", () => {
    const state = new OverlayState({
      isDefaultOpen: true,
      confirmOnClose: true,
    });

    state.syncOpen(false);

    expect(state.isOpen).toBe(false);
    expect(state.showConfirmationModal).toBe(false);
  });
});

describe("confirmation sources", () => {
  test("one source asking for a confirmation is enough", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    state.setConfirmOnCloseSource({}, false);
    state.setConfirmOnCloseSource({}, true);
    state.setConfirmOnCloseSource({}, false);

    state.close();

    expect(state.confirmOnCloseEnabled).toBe(true);
    expect(state.showConfirmationModal).toBe(true);
    expect(state.isOpen).toBe(true);
  });

  test("a source removed while a confirmation is pending no longer asks", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    const source = {};
    state.setConfirmOnCloseSource(source, true);
    state.close();
    expect(state.showConfirmationModal).toBe(true);

    state.removeConfirmOnCloseSource(source);
    expect(state.confirmOnCloseEnabled).toBe(false);
    // Current behaviour, not a fix: nothing withdraws the pending confirmation.
    expect(state.showConfirmationModal).toBe(true);

    state.close();
    expect(state.isOpen).toBe(false);
  });

  test("a grant suppresses the confirmation, and a released grant re-arms it", () => {
    const state = new OverlayState({
      isDefaultOpen: true,
      confirmOnClose: true,
    });

    const release = state.grantCloseWithoutConfirmation();
    state.close();
    expect(state.showConfirmationModal).toBe(false);
    expect(state.isOpen).toBe(false);

    release();
    state.open();
    state.close();
    expect(state.showConfirmationModal).toBe(true);
    expect(state.isOpen).toBe(true);
  });
});
