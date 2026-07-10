import type { RefObject } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { getVisibleItemCount } from "./lib";

interface CollapsingItemsState {
  /** Number of visible items. `null` until the first measurement was done. */
  visibleCount: number | null;
  /** Whether at least one item does not fit and is collapsed. */
  hasOverflow: boolean;
  /** Whether one of the collapsed items contains the current page link. */
  menuHasCurrentItem: boolean;
}

interface UseCollapsingItemsReturn extends CollapsingItemsState {
  listRef: RefObject<HTMLUListElement | null>;
  moreRef: RefObject<HTMLDivElement | null>;
}

const initialState: CollapsingItemsState = {
  visibleCount: null,
  hasOverflow: false,
  menuHasCurrentItem: false,
};

/**
 * Observes the items of the list and computes how many of them fit into the
 * available width of the list's parent element. Items that do not fit are
 * hidden via `visibility: hidden` (removes them from the accessibility tree and
 * the tab order while keeping them measurable). The width of the "more" element
 * is reserved whenever items are collapsed, so it must always be rendered
 * (visually hidden when there is no overflow).
 */
export const useCollapsingItems = (): UseCollapsingItemsReturn => {
  const listRef = useRef<HTMLUListElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState(initialState);

  const update = useCallback(() => {
    const list = listRef.current;
    const more = moreRef.current;
    const container = list?.parentElement;

    if (!list || !more || !container) {
      return;
    }

    const items = Array.from(list.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    const containerStyle = window.getComputedStyle(container);
    const availableWidth =
      container.clientWidth -
      (parseFloat(containerStyle.paddingInlineStart) || 0) -
      (parseFloat(containerStyle.paddingInlineEnd) || 0);

    const visibleCount = getVisibleItemCount(
      items.map((item) => item.getBoundingClientRect().width),
      availableWidth,
      more.getBoundingClientRect().width,
    );

    items.forEach((item, index) => {
      item.style.visibility = index < visibleCount ? "" : "hidden";
    });

    const menuHasCurrentItem = items
      .slice(visibleCount)
      .some(
        (item) =>
          !!item.querySelector('[aria-current]:not([aria-current="false"])'),
      );

    setState((previous) => {
      const next: CollapsingItemsState = {
        visibleCount,
        hasOverflow: visibleCount < items.length,
        menuHasCurrentItem,
      };

      const isUnchanged =
        previous.visibleCount === next.visibleCount &&
        previous.hasOverflow === next.hasOverflow &&
        previous.menuHasCurrentItem === next.menuHasCurrentItem;

      return isUnchanged ? previous : next;
    });
  }, []);

  // Runs after every render (no dependency array): the rendered items may
  // have changed, so the observed elements are re-collected and re-measured.
  // `update()` only triggers a re-render when the computed state changed.
  useLayoutEffect(() => {
    const list = listRef.current;
    const more = moreRef.current;
    const container = list?.parentElement;

    if (!list || !more || !container) {
      return;
    }

    // Defers the update to the next animation frame, because updating causes
    // layout changes of observed elements, which would otherwise trigger
    // "ResizeObserver loop" errors.
    let frameRequest: number | null = null;

    const observer = new ResizeObserver(() => {
      if (frameRequest !== null) {
        window.cancelAnimationFrame(frameRequest);
      }
      frameRequest = window.requestAnimationFrame(() => {
        frameRequest = null;
        update();
      });
    });

    observer.observe(container);
    observer.observe(more);
    for (const item of list.children) {
      observer.observe(item);
    }

    update();

    return () => {
      observer.disconnect();
      if (frameRequest !== null) {
        window.cancelAnimationFrame(frameRequest);
      }
    };
  });

  return { ...state, listRef, moreRef };
};

export default useCollapsingItems;
