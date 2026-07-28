import type { RefCallback } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FrameResizeObserver } from "@/lib/dom/createFrameResizeObserver";
import { createFrameResizeObserver } from "@/lib/dom/createFrameResizeObserver";

interface UseObserveOverflowReturn {
  ref: RefCallback<HTMLElement>;
  isOverflowing: boolean;
}

export const useObserveOverflow = (): UseObserveOverflowReturn => {
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<FrameResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measureOverflow = useCallback(() => {
    const element = elementRef.current;
    const parent = element?.parentElement;

    if (!element || !parent) {
      setIsOverflowing(false);
      return;
    }

    // React bails out of the re-render when the boolean is unchanged.
    setIsOverflowing(element.scrollWidth - parent.clientWidth > 1);
  }, []);

  const observeTargets = useCallback(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const targets: Element[] = [element];
    if (element.parentElement) {
      targets.push(element.parentElement);
    }
    targets.push(...element.children);

    observerRef.current?.observe(targets);
  }, []);

  const stopObservers = useCallback(() => {
    observerRef.current?.disconnect();
    mutationObserverRef.current?.disconnect();

    observerRef.current = null;
    mutationObserverRef.current = null;
  }, []);

  const ref: RefCallback<HTMLElement> = useCallback(
    (element) => {
      stopObservers();
      elementRef.current = element;

      if (!element) {
        setIsOverflowing(false);
        return;
      }

      const observer = createFrameResizeObserver(measureOverflow);
      observerRef.current = observer;
      observeTargets();

      // Tab titles are portaled in via UiComponentTunnel, so this component
      // never receives a `children`/count prop to react to — childList
      // mutations are the only signal that a tab was added or removed.
      mutationObserverRef.current = new MutationObserver(() => {
        observeTargets();
        observer.schedule();
      });
      mutationObserverRef.current.observe(element, {
        childList: true,
      });

      observer.schedule();
    },
    [measureOverflow, observeTargets, stopObservers],
  );

  useEffect(() => {
    return stopObservers;
  }, [stopObservers]);

  return {
    ref,
    isOverflowing,
  };
};
