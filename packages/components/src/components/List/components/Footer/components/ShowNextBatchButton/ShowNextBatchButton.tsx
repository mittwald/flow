import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import ShowNextBatchButtonView from "@/components/List/viewComponents/Footer/LoadNextBatchButton";
import { useListViewComponents } from "@/components/List";

export const ShowNextBatchButton: FC = () => {
  const { loadNextBatchButton: View = ShowNextBatchButtonView } =
    useListViewComponents();

  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const pagination = list.batches;
  const canLoadMore = pagination.hasNextBatch();

  if (!canLoadMore && !isLoading) {
    return null;
  }

  return (
    <View
      isPending={isLoading && !isInitiallyLoading}
      isDisabled={isInitiallyLoading}
      onPress={() => list.batches.nextBatch()}
    />
  );
};

export default ShowNextBatchButton;
