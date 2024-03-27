import React, { FC, Suspense } from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ItemList.module.css";
import clsx from "clsx";
import { Item } from "@/components/List/components/Items/Item";

interface Props {
  className?: string;
}

export const ItemList: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();
  const isLoading = list.loader.useIsLoading();

  const rows = list.items.entries.map((i) => (
    <Item key={i.id}>
      <Suspense>{i.render()}</Suspense>
    </Item>
  ));

  const rootClassName = clsx(
    styles.itemList,
    className,
    isLoading && styles.isLoading,
  );

  return <div className={rootClassName}>{rows}</div>;
};

export default ItemList;
