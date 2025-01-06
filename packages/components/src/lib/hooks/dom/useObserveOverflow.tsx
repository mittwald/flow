import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useCallbackRef } from "use-callback-ref";

interface UseObserveOverflowReturn {
  ref: RefObject<never>;
  isOverflowing: boolean;
}

export const useObserveOverflow = (): UseObserveOverflowReturn => {
  const observer = useRef<IntersectionObserver>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const ref = useCallbackRef<never>(null, (el: unknown) => {
    stopObserver();
    startObserver(el);
  });

  const onIntersectionChange: IntersectionObserverCallback = ([
    intersection,
  ]) => {
    if (intersection) {
      setIsOverflowing(!intersection.isIntersecting);
    }
  };

  const startObserver = (el: unknown = ref.current) => {
    if (el && el instanceof Element) {
      const newObserver = new IntersectionObserver(onIntersectionChange, {
        root: el.parentElement,
        // 1 = invoke callback when the element is 100% visible within the parent element
        threshold: 1.0,
      });

      observer.current = newObserver;
      newObserver.observe(el);
    }
  };

  const stopObserver = () => {
    observer.current?.disconnect();
  };

  useEffect(() => {
    startObserver();
    return stopObserver;
  }, [observer.current]);

  return {
    ref,
    isOverflowing,
  } as never;
};
