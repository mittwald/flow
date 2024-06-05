import { Skeleton } from "@/components/Skeleton";
import type { FC } from "react";
import React from "react";
import { ListItem } from "@/components/List/components/Items/ListItem";

export const ItemSkeleton: FC = () => (
  <ListItem>
    <Skeleton height="3rem" />
  </ListItem>
);
