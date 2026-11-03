import Item from "@/components/List/components/Items/components/Item/Item";
import { useList } from "@/components/List/hooks/useList";
import DivView from "@/views/DivView";
import ItemsGridListView from "@/views/ItemsGridListView";
import clsx from "clsx";
import type { FC, ReactElement } from "react";
import { useRef } from "react";
import { isShallowEqual } from "remeda";
import type List from "@/components/List/model/List";
import styles from "./Items.module.scss";
import { FallbackItems } from "./components/FallbackItems";
import { useInfiniteScrollTrigger } from "@/components/List/hooks/useInfiniteScrollTrigger";
import { useLatestOnAction } from "@/components/List/hooks/useLatestOnAction";

interface LastRender {
  inputs: unknown[];
  list: List<never>;
  element: ReactElement;
}

export const Items: FC = () => {
  const list = useList();
  const lastRender = useRef<LastRender | null>(null);
  const tiles = list.viewMode.isTiles;
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const isLoadingMore = list.loader.useIsLoadingMore();

  const { triggerRef, triggerIndex } = useInfiniteScrollTrigger();

  const onAction = useLatestOnAction(list);

  if (!list.itemView) {
    return null;
  }

  /*
   * react-aria re-renders every item whenever its GridList renders, Flow's
   * item memo or not. While nothing the items show has changed, the GridList
   * gets the element of the last render, so it does not render at all. Items
   * count as unchanged by the same rule as the item memo.
   */
  const inputs = [
    tiles,
    isLoading,
    isInitiallyLoading,
    isLoadingMore,
    onAction,
    triggerIndex,
    triggerRef,
    list.accordion,
    list.itemView.tileMaxWidth,
    ...list.items.entries.flatMap((item) => [item.id, item.data]),
  ];
  const last = lastRender.current;
  if (
    last &&
    isShallowEqual(last.inputs, inputs) &&
    isShallowEqual(last.list.componentProps, list.componentProps) &&
    list.items.entries.every(
      (item) => !!last.list.itemView?.rendersSameFor(list.itemView, item.data),
    )
  ) {
    return last.element;
  }

  const items = list.items.entries.map((item, index) => (
    <Item
      key={item.id}
      data={item.data}
      id={item.id}
      list={list}
      onAction={onAction}
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

  const element = (
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
  lastRender.current = { inputs, list, element };
  return element;
};

export default Items;
