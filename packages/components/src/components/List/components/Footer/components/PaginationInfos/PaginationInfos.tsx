import { useList } from "@/components/List/hooks/useList";
import type { TextProps } from "@/components/Text";
import SkeletonView from "@/views/SkeletonView";
import TextView from "@/views/TextView";
import type { FC } from "react";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";

export const PaginationInfos: FC<TextProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  const list = useList();
  const pagination = list.batches;
  const isLoading = list.loader.useIsLoading();
  const isEmpty = list.useIsEmpty();

  const totalItemsCount = pagination.getTotalItemsCount();
  const visibleItemsCount = pagination.getVisibleItemsCount();

  if (isEmpty) {
    return null;
  }

  const text = isLoading ? (
    <SkeletonView width="200px" />
  ) : (
    stringFormatter.format("paginationInfo", {
      visibleItemsCount,
      totalItemsCount,
    })
  );

  return <TextView {...props}>{text}</TextView>;
};

export default PaginationInfos;
