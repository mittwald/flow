import type { CSSProperties, RefCallback } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface TabIndicatorState {
  x: number;
  width: number;
  isAnimated: boolean;
}

interface TabIndicatorStyle extends CSSProperties {
  "--tab-indicator-x": string;
  "--tab-indicator-width": string;
}

const getTabIndicatorStyle = (
  state: TabIndicatorState | undefined,
): TabIndicatorStyle | undefined =>
  state && {
    "--tab-indicator-x": `${state.x}px`,
    "--tab-indicator-width": `${state.width}px`,
  };

export const useTabIndicator = (isCollapsed: boolean) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titlesRef = useRef<HTMLDivElement | null>(null);
  const hasMeasuredRef = useRef(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [indicator, setIndicator] = useState<TabIndicatorState | undefined>();

  const resetIndicator = () => {
    hasMeasuredRef.current = false;
    setIndicator((previousIndicator) =>
      previousIndicator ? undefined : previousIndicator,
    );
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const titles = titlesRef.current;

    if (!root || !titles || isCollapsed) {
      resetIndicator();
      return;
    }

    const measureIndicator = () => {
      const selectedTab = titles.querySelector<HTMLElement>("[data-selected]");

      if (!selectedTab) {
        resetIndicator();
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const selectedTabRect = selectedTab.getBoundingClientRect();
      const nextIndicator: TabIndicatorState = {
        x: selectedTabRect.left - rootRect.left,
        width: selectedTabRect.width,
        isAnimated: hasMeasuredRef.current,
      };

      setIndicator((previousIndicator) => {
        if (
          previousIndicator &&
          previousIndicator.x === nextIndicator.x &&
          previousIndicator.width === nextIndicator.width &&
          previousIndicator.isAnimated === nextIndicator.isAnimated
        ) {
          return previousIndicator;
        }

        return nextIndicator;
      });

      hasMeasuredRef.current = true;
    };

    const scheduleMeasurement = () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = undefined;
        measureIndicator();
      });
    };

    measureIndicator();

    const resizeObserver = new ResizeObserver(scheduleMeasurement);
    resizeObserver.observe(root);
    resizeObserver.observe(titles);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  });

  const setRootRef: RefCallback<HTMLDivElement> = useCallback((element) => {
    rootRef.current = element;
  }, []);

  const setTitlesRef: RefCallback<HTMLDivElement> = useCallback((element) => {
    titlesRef.current = element;
  }, []);

  return {
    rootRef: setRootRef,
    titlesRef: setTitlesRef,
    indicatorStyle: getTabIndicatorStyle(indicator),
    isAnimated: indicator?.isAnimated ?? false,
  };
};
