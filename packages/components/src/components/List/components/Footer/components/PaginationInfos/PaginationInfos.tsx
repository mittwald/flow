import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import { useListViewComponents } from "@/components/List";
import PaginationInfosView from "@/components/List/viewComponents/Footer/PaginationInfos";

export const PaginationInfos: FC = () => {
  const { paginationInfos: View = PaginationInfosView } =
    useListViewComponents();

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
