import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Text } from "@/components/Text";
import type { FC } from "react";
import React from "react";
import { Skeleton } from "@/components/Skeleton";

interface Props {
  totalItemsCount: number;
  visibleItemsCount: number;
  isInitiallyLoading?: boolean;
}

export const PaginationInfos: FC<Props> = (props) => {
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
