import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

export const PaginationInfos: FC = () => {
  const View = useViewComponent(
    "ListPaginationInfosView",
    ListViews.PaginationInfos,
  );

  const list = useList();
  const pagination = list.batches;
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isEmpty = list.useIsEmpty();

  const totalItemsCount = pagination.getTotalItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  if (isEmpty) {
    return null;
  }

  return (
    <View
      totalItemsCount={totalItemsCount}
      visibleItemsCount={visibleItemsCount}
      isInitiallyLoading={isInitiallyLoading}
    />
  );
};

export default PaginationInfos;
