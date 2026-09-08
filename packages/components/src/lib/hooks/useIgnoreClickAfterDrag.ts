import { useEffect, useRef } from "react";

/*
 * Far enough that no ordinary click reaches it — a click is not meant to be
 * pixel-perfect — and short enough to catch a deliberate drag.
 */
const dragThreshold = 10;

const interactiveElements =
  'a[href], button, input, select, textarea, [contenteditable], [role="button"]';

const hasTextSelectionWithin = (element: Element) => {
  const selection = element.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return false;
  }
  return element.contains(selection.getRangeAt(0).commonAncestorContainer);
};

/**
 * Returns a ref for the element containing pressable items. React Aria triggers
 * an item's press from its click event, so the click that ends a mouse drag is
 * swallowed in the capture phase — otherwise selecting an item's text would
 * activate the item as well, and a drag that missed the text would navigate
 * away instead of doing nothing.
 *
 * A click that changed the text selection is swallowed regardless of distance,
 * which covers selecting a single character and selecting by long press on
 * touch. A drag that started on an interactive child is left alone, as is any
 * click that arrives without a pointer interaction — keyboard, screen reader,
 * `element.click()`.
 */
export const useIgnoreClickAfterDrag = <
  T extends HTMLElement = HTMLElement,
>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const ownerDocument = element.ownerDocument;
    let pointerDownPosition: { x: number; y: number } | undefined;
    let selectionChanged = false;
    let isDrag = false;

    const onSelectionChange = () => {
      selectionChanged = true;
    };

    const onPointerDown = (event: PointerEvent) => {
      selectionChanged = false;
      isDrag = false;
      pointerDownPosition =
        event.pointerType === "mouse" &&
        event.target instanceof Element &&
        !event.target.closest(interactiveElements)
          ? { x: event.clientX, y: event.clientY }
          : undefined;
    };

    const onPointerUp = (event: PointerEvent) => {
      isDrag =
        !!pointerDownPosition &&
        Math.hypot(
          event.clientX - pointerDownPosition.x,
          event.clientY - pointerDownPosition.y,
        ) > dragThreshold;
      pointerDownPosition = undefined;
    };

    const onClick = (event: MouseEvent) => {
      const changedSelection = selectionChanged;
      const draggedFar = isDrag;
      selectionChanged = false;
      isDrag = false;

      if (draggedFar || (changedSelection && hasTextSelectionWithin(element))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    ownerDocument.addEventListener("selectionchange", onSelectionChange);
    element.addEventListener("pointerdown", onPointerDown, true);
    element.addEventListener("pointerup", onPointerUp, true);
    element.addEventListener("click", onClick, true);

    return () => {
      ownerDocument.removeEventListener("selectionchange", onSelectionChange);
      element.removeEventListener("pointerdown", onPointerDown, true);
      element.removeEventListener("pointerup", onPointerUp, true);
      element.removeEventListener("click", onClick, true);
    };
  }, []);

  return ref;
};
