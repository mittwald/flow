import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./Items.module.css";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import { type GridListProps } from "react-aria-components";
import Item from "@/components/List/components/Items/components/Item/Item";
import { EmptyView } from "@/components/List/components/Items/components/EmptyView/EmptyView";
import { FallbackItems } from "@/components/List/components/Items/components/FallbackItems/FallbackItems";

export type ItemListProps = Pick<
  GridListProps<never>,
  "aria-labelledby" | "aria-label" | "className" | "onAction"
>;

export const Items: FC<ItemListProps> = (props) => {
  const { className, ...rest } = props;
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const listIsEmpty = list.useIsEmpty();

  const rows = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} />
  ));

  const rootClassName = clsx(
    styles.items,
    className,
    isLoading && styles.isLoading,
  );

  if (listIsEmpty) {
    return <EmptyView />;
  }

  return (
    <div aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <Aria.GridList className={rootClassName} {...rest}>
        {isInitiallyLoading ? <FallbackItems /> : rows}
      </Aria.GridList>
    </div>
  );
};

export default Items;
