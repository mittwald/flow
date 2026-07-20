import type { RefCallback } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseObserveOverflowReturn {
  ref: RefCallback<HTMLElement>;
  isOverflowing: boolean;
}

export const useObserveOverflow = (): UseObserveOverflowReturn => {
  const elementRef = useRef<HTMLElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measureOverflow = useCallback(() => {
    const element = elementRef.current;
    const parent = element?.parentElement;

    if (!element || !parent) {
      setIsOverflowing(false);
      return;
    }

    const nextIsOverflowing = element.scrollWidth - parent.clientWidth > 1;

    setIsOverflowing((currentIsOverflowing) =>
      currentIsOverflowing === nextIsOverflowing
        ? currentIsOverflowing
        : nextIsOverflowing,
    );
  }, []);

  const scheduleMeasurement = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = undefined;
      measureOverflow();
    });
  }, [measureOverflow]);

  const observeResizeTargets = useCallback(() => {
    const element = elementRef.current;
    const resizeObserver = resizeObserverRef.current;

    if (!element || !resizeObserver) {
      return;
    }

    resizeObserver.disconnect();
    resizeObserver.observe(element);

    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    for (const child of element.children) {
      resizeObserver.observe(child);
    }
  }, []);

  const stopObservers = useCallback(() => {
    resizeObserverRef.current?.disconnect();
    mutationObserverRef.current?.disconnect();

    resizeObserverRef.current = null;
    mutationObserverRef.current = null;

    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const ref: RefCallback<HTMLElement> = useCallback(
    (element) => {
      stopObservers();
      elementRef.current = element;

      if (!element) {
        setIsOverflowing(false);
        return;
      }

      resizeObserverRef.current = new ResizeObserver(scheduleMeasurement);
      observeResizeTargets();

      // Tab titles are portaled in via UiComponentTunnel, so this component
      // never receives a `children`/count prop to react to — childList
      // mutations are the only signal that a tab was added or removed.
      mutationObserverRef.current = new MutationObserver(() => {
        observeResizeTargets();
        scheduleMeasurement();
      });
      mutationObserverRef.current.observe(element, {
        childList: true,
      });

      scheduleMeasurement();
    },
    [observeResizeTargets, scheduleMeasurement, stopObservers],
  );

  useEffect(() => {
    return stopObservers;
  }, [stopObservers]);

  return {
    ref,
    isOverflowing,
  };
};
