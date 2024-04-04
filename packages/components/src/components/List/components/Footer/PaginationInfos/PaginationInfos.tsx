import locales from "../../../locales/*.locale.json";
import { useMessageFormatter } from "react-aria";
import { Text, TextProps } from "@/components/Text";
import React, { FC } from "react";
import { useList } from "@/components/List/hooks/useList";

export const PaginationInfos: FC<TextProps> = (props) => {
  const stringFormatter = useMessageFormatter(locales);

  const list = useList();
  const pagination = list.pagination;
  const isFiltered = list.isFiltered() && !list.loader.manualFiltering;

  const totalItemsCount = pagination.getTotalItemsCount();
  const filteredItemsCount = pagination.getFilteredItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  if (totalItemsCount === 0) {
    return null;
  }

  const text = isFiltered
    ? stringFormatter("paginationInfoFiltered", {
        visibleItemsCount,
        filteredItemsCount,
        totalItemsCount,
      })
    : stringFormatter("paginationInfo", {
        visibleItemsCount,
        totalItemsCount,
      });

  return <Text {...props}>{text}</Text>;
};

export default PaginationInfos;
