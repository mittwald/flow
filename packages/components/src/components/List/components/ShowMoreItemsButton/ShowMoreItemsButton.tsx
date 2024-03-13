import React, { FC } from "react";
import { Button, ButtonProps } from "@/components/Button";
import { useList } from "@/components/List/hooks/useList";
import locales from "../../locales/*.locale.json";
import { useMessageFormatter } from "react-aria";

export const ShowMoreItemsButton: FC<ButtonProps> = (props) => {
  const stringFormatter = useMessageFormatter(locales);
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const pagination = list.pagination;
  const canLoadMore = pagination.hasNextPage();

  return (
    <Button
      isPending={isLoading}
      {...props}
      onPress={() => list.loader.loadMore()}
      style="plain"
      isDisabled={!canLoadMore}
    >
      {stringFormatter("showMore")}
    </Button>
  );
};

export default ShowMoreItemsButton;
