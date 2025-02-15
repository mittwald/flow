import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./Items.module.scss";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import Item from "@/components/List/components/Items/components/Item/Item";
import { EmptyView } from "@/components/List/components/EmptyView/EmptyView";
import { FallbackItems } from "@/components/List/components/Items/components/FallbackItems/FallbackItems";

interface Props {
  tiles?: boolean;
}

export const Items: FC<Props> = (props) => {
  const { tiles } = props;

  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  if (!list.itemView) {
    return null;
  }

  const rows = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} id={item.id} tiles={tiles} />
  ));

  const rootClassName = clsx(
    styles.items,
    isLoading && styles.isLoading,
    tiles && styles.tiles,
  );

  return (
    <div aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <Aria.GridList
        className={rootClassName}
        {...list.componentProps}
        renderEmptyState={() => <EmptyView />}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${list.itemView.tileMaxWidth}px, 1fr))`,
        }}
      >
        {isInitiallyLoading ? <FallbackItems /> : rows}
      </Aria.GridList>
    </div>
  );
};

export default Items;
