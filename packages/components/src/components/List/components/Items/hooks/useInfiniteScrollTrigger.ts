import { useEffect, useEffectEvent, type RefObject } from "react";
import { useList } from "@/components/List/hooks/useList";

const loadMoreThresholdFactor = 0.2;
const minLoadMoreThresholdRows = 1;
const maxLoadMoreThresholdRows = 8;

export const getLoadMoreThresholdRows = (batchSize: number): number =>
  Math.min(
    maxLoadMoreThresholdRows,
    Math.max(
      minLoadMoreThresholdRows,
      Math.round(batchSize * loadMoreThresholdFactor),
    ),
  );

export const useInfiniteScrollTrigger = (
  triggerRef: RefObject<HTMLElement | null>,
): void => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const visibleItemsCount = list.batches.getVisibleItemsCount();

  const loadNextBatch = useEffectEvent(() => {
    if (list.batches.hasNextBatch() && !isLoading) {
      list.batches.nextBatch();
    }
  });

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadNextBatch();
      }
    });
    observer.observe(trigger);

    return () => observer.disconnect();
  }, [loadNextBatch, triggerRef, visibleItemsCount]);
};
