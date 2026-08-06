import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";
import { ListItemSkeletonView } from "../ListItemSkeletonView/ListItemSkeletonView";

export type ItemLoadingViewProps = unknown;

/**
 * The loading representation of a single list item: the item view's custom
 * `loadingView` when configured, the default skeleton otherwise.
 */
export const ItemLoadingView: FC<ItemLoadingViewProps> = () => {
  const list = useList();

  return (
    list.itemView?.loadingView ?? (
      <ListItemSkeletonView viewMode={list.viewMode.value} />
    )
  );
};
