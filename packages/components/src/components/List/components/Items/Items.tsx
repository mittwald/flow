import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import styles from "./Items.module.css";
import clsx from "clsx";
import Item from "~/components/List/components/Items/components/Item/Item";
import { FallbackItems } from "~/components/List/components/Items/components/FallbackItems/FallbackItems";
import GridList from "~/components/List/components/Items/views/GridList/GridList";
import { Div } from "~/components/Div";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

export const Items: FC = () => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  const { DivView, ItemsGridListView } = useViewComponents(
    ["Div", Div],
    ["ItemsGridList", GridList],
  );

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
