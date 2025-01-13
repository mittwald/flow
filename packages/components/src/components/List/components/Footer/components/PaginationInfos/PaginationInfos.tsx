import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import PaginationInfosView from "@/components/List/views/Footer/PaginationInfos";
import { useViewComponents } from "@/lib/viewComponentContext/useViewComponents";

export const PaginationInfos: FC = () => {
  const { PaginationInfos: View = PaginationInfosView } =
    useViewComponents("List");

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
