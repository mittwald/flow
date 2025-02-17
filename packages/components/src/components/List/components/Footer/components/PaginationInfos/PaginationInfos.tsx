import locales from "../../../../locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";
import type { TextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import { Skeleton } from "@/components/Skeleton";

export const PaginationInfos: FC<TextProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  const list = useList();
  const pagination = list.batches;
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isEmpty = list.useIsEmpty();

  const totalItemsCount = pagination.getTotalItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  if (isEmpty) {
    return null;
  }

  const text = isInitiallyLoading ? (
    <Skeleton width="200px" />
  ) : (
    stringFormatter.format("list.paginationInfo", {
      visibleItemsCount,
      totalItemsCount,
    })
  );

  return <Text {...props}>{text}</Text>;
};

export default PaginationInfos;
