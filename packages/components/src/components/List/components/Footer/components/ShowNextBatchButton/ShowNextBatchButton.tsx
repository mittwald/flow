import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import ShowNextBatchButtonView from "@/components/List/views/Footer/LoadNextBatchButton";
import { useViewComponents } from "@/lib/viewComponentContext/useViewComponents";

export const ShowNextBatchButton: FC = () => {
  const { LoadNextBatchButton: View = ShowNextBatchButtonView } =
    useViewComponents("List");

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
