import { ItemContainer } from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import ListItemSkeletonViewView from "@/views/ListItemSkeletonViewView";
import type { FC } from "react";
import { cloneElement } from "react";

export type FallbackItemsProps = unknown;

export const FallbackItems: FC<FallbackItemsProps> = () => {
  const list = useList();
  const fallback = list.itemView?.fallback ?? (
    <ListItemSkeletonViewView viewMode={list.viewMode} />
  );

  return Array.from(Array(5)).map((_, i) => (
    <ItemContainer id={i} data={i as never} key={i}>
      {cloneElement(fallback)}
    </ItemContainer>
  ));
};
