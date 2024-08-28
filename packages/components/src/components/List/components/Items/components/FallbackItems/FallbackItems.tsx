import type { FC } from "react";
import React, { cloneElement } from "react";
import { useList } from "@/components/List/hooks/useList";
import { SkeletonView } from "@/components/List/components/Items/components/Item/components/SkeletonView/SkeletonView";
import { ItemContainer } from "@/components/List/components/Items/components/Item/Item";

export const FallbackItems: FC = () => {
  const list = useList();
  const fallback = list.itemView.fallback ?? <SkeletonView />;

  return Array.from(Array(5)).map((_, i) => (
    <ItemContainer key={i}>{cloneElement(fallback)}</ItemContainer>
  ));
};
