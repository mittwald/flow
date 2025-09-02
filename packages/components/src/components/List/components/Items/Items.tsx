import { EmptyView } from "@/components/List";
import Item from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import DivView from "@/views/DivView";
import ItemsGridListView from "@/views/ItemsGridListView";
import clsx from "clsx";
import type { FC } from "react";
import styles from "./Items.module.scss";
import { FallbackItems } from "./components/FallbackItems";

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
        layout={list.viewMode === "tiles" ? "grid" : "stack"}
      >
        {items.length === 0 && isLoading ? <FallbackItems /> : items}
      </ItemsGridListView>
    </DivView>
  );
};

export default Items;
