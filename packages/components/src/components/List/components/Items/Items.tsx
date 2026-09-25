import Item from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import DivView from "@/views/DivView";
import ItemsGridListView from "@/views/ItemsGridListView";
import clsx from "clsx";
import type { FC } from "react";
import styles from "./Items.module.scss";
import { FallbackItems } from "./components/FallbackItems";
import { useInfiniteScrollTrigger } from "@/components/List/hooks/useInfiniteScrollTrigger";

export const Items: FC = () => {
  const list = useList();
  const tiles = list.viewMode.isTiles;
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isLoadingMore = list.loader.useIsLoadingMore();

  const { triggerRef, triggerIndex } = useInfiniteScrollTrigger();

  if (!list.itemView) {
    return null;
  }

  const items = list.items.entries.map((item, index) => (
    <Item
      key={item.id}
      data={item.data}
      id={item.id}
      list={list}
      isTile={tiles}
      triggerRef={index === triggerIndex ? triggerRef : undefined}
    />
  ));

  const rootClassName = clsx(
    styles.items,
    isLoading && !(list.infiniteScroll && isLoadingMore) && styles.isLoading,
    tiles && styles.tiles,
  );

  const {
    "aria-labelledby": ariaLabelledby,
    "aria-label": ariaLabel,
    ...rest
  } = list.componentProps;

  return (
    <DivView aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <ItemsGridListView
        className={rootClassName}
        {...rest}
        aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
        aria-label={ariaLabel}
        layout={tiles ? "grid" : "stack"}
        tileMaxWidth={list.itemView.tileMaxWidth}
      >
        {items.length === 0 && isInitiallyLoading ? <FallbackItems /> : items}
      </ItemsGridListView>
    </DivView>
  );
};

export default Items;
