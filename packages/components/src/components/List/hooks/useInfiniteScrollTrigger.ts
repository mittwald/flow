import { useEffect, useEffectEvent, useState, type RefCallback } from "react";
import { useList } from "./useList";

const loadMoreThresholdFactor = 0.2;
const minLoadMoreThresholdRows = 1;
const maxLoadMoreThresholdRows = 8;

const getLoadMoreThresholdRows = (batchSize: number): number =>
  Math.min(
    maxLoadMoreThresholdRows,
    Math.max(
      minLoadMoreThresholdRows,
      Math.round(batchSize * loadMoreThresholdFactor),
    ),
  );

interface InfiniteScrollTrigger {
  /**
   * Attach to whatever the view renders for `triggerIndex`. A callback ref, so
   * the observer follows the trigger as it moves on with every loaded batch — a
   * ref object would leave the effect without a signal that the element it
   * observes has been replaced.
   */
  triggerRef: RefCallback<HTMLElement>;
  /**
   * Index of the item that loads the next batch once it scrolls into view, or
   * `undefined` while infinite scrolling is off.
   */
  triggerIndex: number | undefined;
}

export const useInfiniteScrollTrigger = (): InfiniteScrollTrigger => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  const loadNextBatch = useEffectEvent(() => {
    if (list.batches.hasNextBatch() && !isLoading) {
      list.batches.nextBatch();
    }
  });

  useEffect(() => {
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
  }, [trigger]);

  return {
    triggerRef: setTrigger,
    triggerIndex: list.infiniteScroll
      ? Math.max(
          0,
          list.items.entries.length -
            getLoadMoreThresholdRows(list.batches.batchSize),
        )
      : undefined,
  };
};
