import { renderHook, act } from "@testing-library/react";
import { useOverlayController } from "~/lib/controller";
import { useOverlayContext } from "~/lib/controller/overlay/context";
import { OverlayController } from "~/lib/controller";
import type { Mock } from "vitest";
import { vitest, describe, test, expect, beforeEach } from "vitest";

vitest.mock("~/lib/controller/overlay/context", () => ({
  useOverlayContext: vitest.fn(),
}));

describe("useOverlayController", () => {
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

  test("should use controller from context when reuseControllerFromContext is true", () => {
    const { result } = renderHook(() =>
      useOverlayController("Modal", {
        reuseControllerFromContext: true,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    expect(result.current).toBe(contextController);
  });

  test("should create new controller when reuseControllerFromContext is false", () => {
    const { result } = renderHook(() =>
      useOverlayController("Modal", {
        reuseControllerFromContext: false,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    expect(result.current).not.toBe(contextController);
  });

  test("should add onOpen handler when controller is closed", () => {
    const { result } = renderHook(() =>
      useOverlayController("Modal", {
        onOpen: mockOnOpen,
      }),
    );

    act(() => {
      result.current.open();
    });

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should add onClose handler when controller is open", () => {
    contextController.open();

    const { result } = renderHook(() =>
      useOverlayController("Modal", {
        onClose: mockOnClose,
      }),
    );

    act(() => {
      result.current.close();
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("should cleanup handlers on unmount", () => {
    const { unmount } = renderHook(() =>
      useOverlayController("Modal", {
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      }),
    );

    unmount();

    act(() => {
      contextController.open();
      contextController.close();
    });

    expect(mockOnOpen).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("should update handlers when options change", () => {
    const newMockOnOpen = vitest.fn();
    const { rerender } = renderHook(
      (props) => useOverlayController("Modal", props),
      {
        initialProps: { onOpen: mockOnOpen },
      },
    );

    rerender({ onOpen: newMockOnOpen });

    act(() => {
      contextController.open();
    });

    expect(mockOnOpen).not.toHaveBeenCalled();
    expect(newMockOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should handle multiple handlers correctly", () => {
    const secondOnOpen = vitest.fn();

    renderHook(() => useOverlayController("Modal", { onOpen: mockOnOpen }));
    renderHook(() => useOverlayController("Modal", { onOpen: secondOnOpen }));

    act(() => {
      contextController.open();
    });

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
    expect(secondOnOpen).toHaveBeenCalledTimes(1);
  });

  test("should handle undefined handlers gracefully", () => {
    const { result } = renderHook(() => useOverlayController("Modal", {}));

    expect(() => {
      act(() => {
        result.current.open();
        result.current.close();
      });
    }).not.toThrow();
  });
});
