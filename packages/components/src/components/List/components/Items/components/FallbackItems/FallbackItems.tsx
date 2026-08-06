import { ItemContainer } from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";
import { ItemLoadingView } from "../Item/components/ItemLoadingView/ItemLoadingView";

export type FallbackItemsProps = unknown;

export const FallbackItems: FC<FallbackItemsProps> = () => {
  const list = useList();

  return Array.from(Array(list.loadingItemsCount)).map((_, i) => (
    <ItemContainer id={i} data={i as never} key={i}>
      <ItemLoadingView />
    </ItemContainer>
  ));
};
