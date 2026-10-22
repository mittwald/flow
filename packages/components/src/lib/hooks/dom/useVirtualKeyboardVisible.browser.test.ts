import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useVirtualKeyboardVisible } from "./useVirtualKeyboardVisible";

const getViewport = (): VisualViewport => {
  const viewport = window.visualViewport;
  if (!viewport) {
    throw new Error("The test browser has no VisualViewport");
  }
  return viewport;
};

const viewport = getViewport();

const keyboardHeight = 300;

describe("useVirtualKeyboardVisible", () => {
  let addEventListener: ReturnType<typeof vitest.spyOn>;
  let removeEventListener: ReturnType<typeof vitest.spyOn>;
  let readHeight: ReturnType<typeof vitest.spyOn>;

  beforeEach(() => {
    addEventListener = vitest.spyOn(viewport, "addEventListener");
    removeEventListener = vitest.spyOn(viewport, "removeEventListener");
    // Pretend the on-screen keyboard is open.
    readHeight = vitest
      .spyOn(VisualViewport.prototype, "height", "get")
      .mockImplementation(() => window.innerHeight - keyboardHeight);
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  test("reports the open keyboard while enabled", async () => {
    const { result } = await renderHook(() => useVirtualKeyboardVisible());

    expect(result.current).toBe(true);
    expect(addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  test("neither reads the viewport nor listens while disabled", async () => {
    const { result } = await renderHook(() => useVirtualKeyboardVisible(false));

    expect(result.current).toBe(false);
    expect(readHeight).not.toHaveBeenCalled();
    expect(addEventListener).not.toHaveBeenCalled();
  });

  test("stops listening when disabled and reads again when re-enabled", async () => {
    readHeight.mockImplementation(() => window.innerHeight);
    const { result, rerender } = await renderHook(
      (isEnabled?: boolean) => useVirtualKeyboardVisible(isEnabled),
      { initialProps: true },
    );
    expect(result.current).toBe(false);

    await rerender(false);
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    // The keyboard opens while disabled: no event reaches the hook, so only a
    // fresh read on re-enabling can see it.
    readHeight.mockImplementation(() => window.innerHeight - keyboardHeight);
    await rerender(true);
    expect(result.current).toBe(true);

    await rerender(false);
    expect(result.current).toBe(false);
  });
});
