import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import styles from "./Items.module.css";
import clsx from "clsx";
import Item from "~/components/List/components/Items/components/Item/Item";
import { FallbackItems } from "~/components/List/components/Items/components/FallbackItems/FallbackItems";
import ItemsGridListView from "~/views/ItemsGridListView";
import DivView from "~/views/DivView";

export const Items: FC = () => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  if (!list.itemView) {
    return null;
  }

  const rows = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} id={item.id} />
  ));

  const rootClassName = clsx(styles.items, isLoading && styles.isLoading);

  return (
    <DivView aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <ItemsGridListView className={rootClassName} {...list.componentProps}>
        {isInitiallyLoading ? <FallbackItems /> : rows}
      </ItemsGridListView>
    </DivView>
  );
};

export default Items;
