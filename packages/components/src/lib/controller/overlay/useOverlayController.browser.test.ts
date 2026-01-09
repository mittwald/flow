import { useOverlayController } from "@/lib/controller";
import { useOverlayContext } from "@/lib/controller/overlay/context";
import { OverlayController } from "@/lib/controller";
import type { Mock } from "vitest";
import { vitest, describe, test, expect, beforeEach } from "vitest";
import { renderHook } from "vitest-browser-react";

vitest.mock("@/lib/controller/overlay/context", () => ({
  useOverlayContext: vitest.fn(),
}));

describe("useOverlayController", async () => {
  let mockOnOpen: Mock;
  let mockOnClose: Mock;
  let contextController: OverlayController;

  beforeEach(() => {
    mockOnOpen = vitest.fn();
    mockOnClose = vitest.fn();
    contextController = new OverlayController();

    (useOverlayContext as Mock).mockReturnValue({
      Modal: contextController,
    });
  });

  test("should use controller from context when reuseControllerFromContext is true", async () => {
    const { result } = await renderHook(() =>
      useOverlayController("Modal", {
        reuseControllerFromContext: true,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    expect(result.current).toBe(contextController);
  });

  test("should create new controller when reuseControllerFromContext is false", async () => {
    const { result } = await renderHook(() =>
      useOverlayController("Modal", {
        reuseControllerFromContext: false,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    expect(result.current).not.toBe(contextController);
  });

  test("should add onOpen handler when controller is closed", async () => {
    const { result } = await renderHook(() =>
      useOverlayController("Modal", {
        onOpen: mockOnOpen,
      }),
    );

    result.current.open();

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should add onClose handler when controller is open", async () => {
    contextController.open();

    const { result } = await renderHook(() =>
      useOverlayController("Modal", {
        onClose: mockOnClose,
      }),
    );

    result.current.close();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("should cleanup handlers on unmount", async () => {
    const { unmount } = await renderHook(() =>
      useOverlayController("Modal", {
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    unmount();

    contextController.open();
    contextController.close();

    expect(mockOnOpen).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("should update handlers when options change", async () => {
    const newMockOnOpen = vitest.fn();
    const { rerender } = await renderHook(
      (props) => useOverlayController("Modal", props),
      {
        initialProps: { onOpen: mockOnOpen },
      },
    );

    await rerender({ onOpen: newMockOnOpen });

    contextController.open();

    expect(mockOnOpen).not.toHaveBeenCalled();
    expect(newMockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should handle multiple handlers correctly", async () => {
    const secondOnOpen = vitest.fn();

    await renderHook(() =>
      useOverlayController("Modal", { onOpen: mockOnOpen }),
    );
    await renderHook(() =>
      useOverlayController("Modal", { onOpen: secondOnOpen }),
    );

    contextController.open();

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
    expect(secondOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should handle undefined handlers gracefully", async () => {
    const { result } = await renderHook(() =>
      useOverlayController("Modal", {}),
    );

    expect(() => {
      result.current.open();
      result.current.close();
    }).not.toThrow();
  });
});
