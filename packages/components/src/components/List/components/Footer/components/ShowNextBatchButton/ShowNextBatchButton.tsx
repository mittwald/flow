import type { FC } from "react";
import React from "react";
import type { ButtonProps } from "@/components/Button";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import ButtonView from "@/views/ButtonView";

export const ShowNextBatchButton: FC<ButtonProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const pagination = list.batches;
  const canLoadMore = pagination.hasNextBatch();

  const totalItemsCount = pagination.getTotalItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  if ((!canLoadMore || visibleItemsCount === totalItemsCount) && !isLoading) {
    return null;
  }

  return (
    <ButtonView
      isPending={isLoading && !isInitiallyLoading}
      isDisabled={isInitiallyLoading}
      {...props}
      onPress={() => list.batches.nextBatch()}
      variant="plain"
      size="s"
    >
      {stringFormatter.format("list.showMore")}
    </ButtonView>
  );
};

export default ShowNextBatchButton;
