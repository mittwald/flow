import { useEffect, useState } from "react";

/**
 * Minimum shrinkage (px) of the visual viewport relative to the layout viewport
 * that we treat as "the on-screen keyboard is open". Filters out the much
 * smaller changes caused by mobile browser chrome (e.g. the address bar).
 */
export const VIRTUAL_KEYBOARD_MIN_HEIGHT = 150;

/**
 * Pure predicate: the visual viewport is at least `threshold` px shorter than
 * the layout viewport (i.e. the on-screen keyboard is open).
 */
export const isVirtualKeyboardVisible = (
  layoutViewportHeight: number,
  visualViewportHeight: number,
  threshold: number = VIRTUAL_KEYBOARD_MIN_HEIGHT,
): boolean => layoutViewportHeight - visualViewportHeight > threshold;

/**
 * Tracks whether the on-screen (virtual) keyboard is currently open, using the
 * VisualViewport API. On iOS and Android the layout viewport stays while the
 * visual viewport shrinks by the keyboard height. Returns `false` where
 * VisualViewport is unavailable (SSR, very old browsers).
 */
export const useVirtualKeyboardVisible = (): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }
    const update = (): void => {
      setVisible(isVirtualKeyboardVisible(window.innerHeight, viewport.height));
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return visible;
};
