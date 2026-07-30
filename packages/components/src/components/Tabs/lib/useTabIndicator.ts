import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { createFrameResizeObserver } from "@/lib/dom/createFrameResizeObserver";

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
  const [indicator, setIndicator] = useState<TabIndicatorState | undefined>();

  const resetIndicator = () => {
    hasMeasuredRef.current = false;
    // React bails out of the re-render when the state is already `undefined`.
    setIndicator(undefined);
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

    measureIndicator();

    const observer = createFrameResizeObserver(measureIndicator);
    observer.observe([root, titles]);

    return () => observer.disconnect();
  });

  return {
    rootRef,
    titlesRef,
    indicatorStyle: getTabIndicatorStyle(indicator),
    isAnimated: indicator?.isAnimated ?? false,
  };
};
