import { describe, expect, test } from "vitest";
import {
  isVirtualKeyboardVisible,
  VIRTUAL_KEYBOARD_MIN_HEIGHT,
} from "./useVirtualKeyboardVisible";

describe("isVirtualKeyboardVisible", () => {
  test("false when the visual viewport equals the layout viewport", () => {
    expect(isVirtualKeyboardVisible(800, 800)).toBe(false);
  });

  test("false for a small shrink (browser chrome, not the keyboard)", () => {
    expect(isVirtualKeyboardVisible(800, 700)).toBe(false);
  });

  test("true when the shrink exceeds the threshold (keyboard open)", () => {
    expect(isVirtualKeyboardVisible(800, 500)).toBe(true);
  });

  test("threshold boundary is exclusive", () => {
    expect(
      isVirtualKeyboardVisible(800, 800 - VIRTUAL_KEYBOARD_MIN_HEIGHT),
    ).toBe(false);
    expect(
      isVirtualKeyboardVisible(800, 800 - VIRTUAL_KEYBOARD_MIN_HEIGHT - 1),
    ).toBe(true);
  });

  test("respects a custom threshold", () => {
    expect(isVirtualKeyboardVisible(800, 700, 50)).toBe(true);
  });
});
