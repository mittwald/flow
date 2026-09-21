import { useCallback, useEffectEvent, type RefCallback } from "react";
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

/**
 * Returns the ref for the item whose visibility loads the next batch.
 *
 * A callback ref, not an effect: the trigger item is rendered by a react-aria
 * collection, which attaches its ref after the effects of the component holding
 * it have already run. An effect therefore only ever sees the ref of the
 * _previous_ render, and picks the trigger up by accident — whenever a later
 * render happens to re-run it. Where no later render follows, it never observes
 * anything at all.
 */
export const useInfiniteScrollTrigger = (): RefCallback<HTMLElement> => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isActive = list.batches.isInfiniteScrollActive();

  const loadNextBatch = useEffectEvent(() => {
    if (isActive && list.batches.hasNextBatch() && !isLoading) {
      list.batches.nextBatch();
    }
  });

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadNextBatch();
        }
      });
      observer.observe(element);

      return () => observer.disconnect();
    },
    // `loadNextBatch` is a `useEffectEvent` — stable by construction, and the
    // lint rule forbids listing it.
    [],
  );
};
