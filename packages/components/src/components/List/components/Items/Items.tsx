import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./Items.module.css";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import Item from "@/components/List/components/Items/components/Item/Item";
import { EmptyView } from "@/components/List/components/EmptyView/EmptyView";
import { FallbackItems } from "@/components/List/components/Items/components/FallbackItems/FallbackItems";

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
    <div aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <Aria.GridList
        className={rootClassName}
        {...list.componentProps}
        renderEmptyState={() => <EmptyView />}
      >
        {isInitiallyLoading ? <FallbackItems /> : rows}
      </Aria.GridList>
    </div>
  );
};

export default Items;
