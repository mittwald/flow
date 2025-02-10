import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./Items.module.scss";
import clsx from "clsx";
import Item from "@/components/List/components/Items/components/Item/Item";
import { FallbackItems } from "@/components/List/components/Items/components/FallbackItems/FallbackItems";
import ItemsGridListView from "@/views/ItemsGridListView";
import DivView from "@/views/DivView";
import { EmptyView } from "@/components/List";

export const Items: FC = () => {
  const list = useList();
  const tiles = list.viewMode === "tiles";
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  if (!list.itemView) {
    return null;
  }

  const items = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} id={item.id} />
  ));

  const rootClassName = clsx(
    styles.items,
    isLoading && styles.isLoading,
    tiles && styles.tiles,
  );

  return (
    <DivView aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <ItemsGridListView
        className={rootClassName}
        {...list.componentProps}
        renderEmptyState={() => <EmptyView />}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${list.itemView.tileMaxWidth}px, 1fr))`,
        }}
      >
        {isInitiallyLoading ? <FallbackItems /> : items}
      </ItemsGridListView>
    </DivView>
  );
};

export default Items;
