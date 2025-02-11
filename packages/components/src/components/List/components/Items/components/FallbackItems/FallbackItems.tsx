import { SkeletonView } from "@/components/List/components/Items/components/Item/components/SkeletonView/SkeletonView";
import { ItemContainer } from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";
import { cloneElement } from "react";

export type FallbackItemsProps = never;

/** @flr-generate all */
export const FallbackItems: FC<FallbackItemsProps> = () => {
  const list = useList();
  const fallback = list.itemView?.fallback ?? <SkeletonView />;

  return Array.from(Array(5)).map((_, i) => (
    <ItemContainer id={i} data={i as never} key={i}>
      {cloneElement(fallback)}
    </ItemContainer>
  ));
};
