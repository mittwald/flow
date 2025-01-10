import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Text } from "@/components/Text";
import type { FC } from "react";
import React from "react";
import { Skeleton } from "@/components/Skeleton";

export interface PaginationInfosProps {
  totalItemsCount: number;
  visibleItemsCount: number;
  isInitiallyLoading?: boolean;
}

/** @flr-generate all */
export const PaginationInfos: FC<PaginationInfosProps> = (props) => {
  const { totalItemsCount, visibleItemsCount, isInitiallyLoading } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const text = isInitiallyLoading ? (
    <Skeleton width="200px" />
  ) : (
    stringFormatter.format("list.paginationInfo", {
      visibleItemsCount,
      totalItemsCount,
    })
  );

  return <Text>{text}</Text>;
};

export default PaginationInfos;
