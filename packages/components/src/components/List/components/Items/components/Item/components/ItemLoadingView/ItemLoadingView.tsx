import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";
import { ListItemSkeletonView } from "../ListItemSkeletonView/ListItemSkeletonView";

export type ItemLoadingViewProps = unknown;

export const ItemLoadingView: FC<ItemLoadingViewProps> = () => {
  const list = useList();

  return (
    list.itemView?.loadingView ?? (
      <ListItemSkeletonView viewMode={list.viewMode.value} />
    )
  );
};
