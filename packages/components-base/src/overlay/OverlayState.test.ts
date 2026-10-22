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
    expect(state.showConfirmationModal).toBe(false);

    state.close();
    expect(state.isOpen).toBe(false);
  });

  test("a source turning its requirement off withdraws a pending confirmation", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    const source = {};
    state.setConfirmOnCloseSource(source, true);
    state.close();

    state.setConfirmOnCloseSource(source, false);

    expect(state.showConfirmationModal).toBe(false);
  });

  test("a source that still asks keeps a pending confirmation", () => {
    const state = new OverlayState({ isDefaultOpen: true });
    const source = {};
    state.setConfirmOnCloseSource(source, true);
    state.setConfirmOnCloseSource({}, true);
    state.close();

    state.removeConfirmOnCloseSource(source);

    expect(state.showConfirmationModal).toBe(true);
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

describe("a pending confirmation", () => {
  const pendingConfirmation = () => {
    const state = new OverlayState({
      isDefaultOpen: true,
      confirmOnClose: true,
    });
    state.close();
    expect(state.showConfirmationModal).toBe(true);
    return state;
  };

  test("is dropped by a close that bypasses it", () => {
    const state = pendingConfirmation();

    state.close({ bypassConfirmation: true });
    expect(state.isOpen).toBe(false);
    expect(state.showConfirmationModal).toBe(false);

    state.open();
    expect(state.showConfirmationModal).toBe(false);
  });

  test("is dropped by a close a grant allows", () => {
    const state = pendingConfirmation();

    const release = state.grantCloseWithoutConfirmation();
    state.close();
    release();
    expect(state.isOpen).toBe(false);
    expect(state.showConfirmationModal).toBe(false);

    state.open();
    expect(state.showConfirmationModal).toBe(false);
  });

  test("is dropped by a close that syncs the open state", () => {
    const state = pendingConfirmation();

    state.syncOpen(false);

    expect(state.showConfirmationModal).toBe(false);
  });

  test("stays while a handler aborts the close", () => {
    const state = pendingConfirmation();
    state.addOnClose(() => false);

    state.close({ bypassConfirmation: true });

    expect(state.isOpen).toBe(true);
    expect(state.showConfirmationModal).toBe(true);
  });

  test("leaves no confirmed close behind once the overlay is closed", () => {
    const state = pendingConfirmation();
    state.confirmClose();
    state.syncOpen(false);

    state.syncOpen(true);
    state.close();

    expect(state.showConfirmationModal).toBe(true);
    expect(state.isOpen).toBe(true);
  });
});
