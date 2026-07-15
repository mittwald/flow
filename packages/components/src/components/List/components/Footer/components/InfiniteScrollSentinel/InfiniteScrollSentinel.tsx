import type { FC } from "react";
import React, { useRef } from "react";
import { useLoadMoreSentinel } from "@react-aria/utils";
import type { Collection } from "@react-types/shared";
import { useList } from "@/components/List/hooks/useList";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import DivView from "@/views/DivView";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import locales from "../../../../locales/*.locale.json";
import styles from "./InfiniteScrollSentinel.module.scss";

export const InfiniteScrollSentinel: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");
  const list = useList();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const visibleItemsCount = list.batches.getVisibleItemsCount();

  useLoadMoreSentinel(
    {
      collection: visibleItemsCount as unknown as Collection<object>,
      onLoadMore: () => {
        if (list.batches.hasNextBatch() && !list.loader.loaderState.isLoading) {
          list.batches.nextBatch();
        }
      },
    },
    sentinelRef,
  );

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
