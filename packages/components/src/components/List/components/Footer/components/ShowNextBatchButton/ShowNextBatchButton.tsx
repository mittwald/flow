import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

export const ShowNextBatchButton: FC = () => {
  const View = useViewComponent(
    "ListLoadNextBatchButtonView",
    ListViews.LoadNextBatchButton,
  );

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
