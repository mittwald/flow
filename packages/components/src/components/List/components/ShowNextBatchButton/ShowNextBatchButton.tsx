import type { FC } from "react";
import React from "react";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export const ShowNextBatchButton: FC<ButtonProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const pagination = list.batches;
  const canLoadMore = pagination.hasNextBatch();

  return (
    <Button
      isPending={isLoading}
      {...props}
      onPress={() => list.batches.nextBatch()}
      style="plain"
      isDisabled={!canLoadMore}
    >
      {stringFormatter.format("showMore")}
    </Button>
  );
};

export default ShowNextBatchButton;
