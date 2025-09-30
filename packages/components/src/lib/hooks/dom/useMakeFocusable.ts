import { type RefObject, useEffect } from "react";

/**
 * A hook that makes an element focusable and calls a callback when it receives
 * focus.
 */
export const useMakeFocusable = (
  ref: RefObject<unknown>,
  onFocus?: CallableFunction,
) => {
  useEffect(() => {
    const element = ref.current;
    const shouldProcessElement = element && element instanceof HTMLElement;

    if (!shouldProcessElement) {
      return;
    }

    const onFocusHandler = () => onFocus?.();
    element.addEventListener("focus", onFocusHandler);

    const hasTabIndex = element.hasAttribute("tabIndex");
    if (!hasTabIndex) {
      // when we have no tabIndex, we set it to -1 to make it focusable
      element.setAttribute("tabIndex", "-1");
    }

    return () => {
      element.removeEventListener("focus", onFocusHandler);
      if (!hasTabIndex) {
        element.removeAttribute("tabIndex");
      }
    };
  }, [ref.current, onFocus]);
};
