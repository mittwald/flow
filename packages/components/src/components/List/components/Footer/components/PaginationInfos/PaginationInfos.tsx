import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { TextProps } from "~/components/Text";
import { Text } from "~/components/Text";
import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import { Skeleton } from "~/components/Skeleton";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

export const PaginationInfos: FC<TextProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  const list = useList();
  const pagination = list.batches;
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isEmpty = list.useIsEmpty();

  const totalItemsCount = pagination.getTotalItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  const { SkeletonView, TextView } = useViewComponents(
    ["Skeleton", Skeleton],
    ["Text", Text],
  );

  if (isEmpty) {
    return null;
  }

  const text = isInitiallyLoading ? (
    <SkeletonView width="200px" />
  ) : (
    stringFormatter.format("list.paginationInfo", {
      visibleItemsCount,
      totalItemsCount,
    })
  );

  return <TextView {...props}>{text}</TextView>;
};

export default PaginationInfos;
