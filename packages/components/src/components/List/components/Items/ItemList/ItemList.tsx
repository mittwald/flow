import React, { FC } from "react";
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

  const rows = list.items.entries.map((i) => (
    <Item key={i.id}>{i.render()}</Item>
  ));

  return <div className={clsx(styles.items, className)}>{rows}</div>;
};

export default ItemList;
