import type { FC } from "react";
import React, { useEffect, useEffectEvent, useRef } from "react";
import { useList } from "@/components/List/hooks/useList";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import DivView from "@/views/DivView";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import locales from "../../../../locales/*.locale.json";
import styles from "./InfiniteScrollSentinel.module.scss";

const rootMargin = "0px 0px 150px 0px";

export const InfiniteScrollSentinel: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");
  const list = useList();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  const visibleItemsCount = list.batches.getVisibleItemsCount();

  const loadNextBatch = useEffectEvent(() => {
    if (list.batches.hasNextBatch() && !isLoading) {
      list.batches.nextBatch();
    }
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadNextBatch();
        }
      },
      { rootMargin },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadNextBatch, visibleItemsCount]);

  const showSpinner = isLoading && !isInitiallyLoading;

  return (
    <>
      <DivView aria-hidden ref={sentinelRef} className={styles.sentinel} />
      {showSpinner && (
        <LoadingSpinnerView
          aria-label={stringFormatter.format("loadingMore")}
        />
      )}
    </>
  );
};

export default InfiniteScrollSentinel;
