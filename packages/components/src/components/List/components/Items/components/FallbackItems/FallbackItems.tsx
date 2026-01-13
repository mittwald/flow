import { ItemContainer } from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";
import { cloneElement } from "react";
import { ListItemSkeletonView } from "../Item/components/ListItemSkeletonView/ListItemSkeletonView";

export type FallbackItemsProps = unknown;

export const FallbackItems: FC<FallbackItemsProps> = () => {
  const list = useList();
  const fallback = list.itemView?.loadingView ?? (
    <ListItemSkeletonView viewMode={list.viewMode} />
  );

  return Array.from(Array(list.loadingItemsCount)).map((_, i) => (
    <ItemContainer id={i} data={i as never} key={i}>
      {cloneElement(fallback)}
    </ItemContainer>
  ));
};
