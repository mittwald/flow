import { Skeleton } from "@/components/Skeleton";
import type { FC } from "react";
import React from "react";
import styles from "./ItemSkeleton.module.css";
import { Item } from "@/components/List/components/Items/Item";

export const ItemSkeleton: FC = () => (
  <Item>
    <Skeleton className={styles.itemSkeleton} />
  </Item>
);
