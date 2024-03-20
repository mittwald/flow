import React, { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./Items.module.css";
import clsx from "clsx";
import { Item } from "@/components/List/components/Item";

interface Props {
  className?: string;
}

export const Items: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();

  const rows = list.items.entries.map((i) => (
    <Item key={i.id}>{i.render()}</Item>
  ));

  return <div className={clsx(styles.items, className)}>{rows}</div>;
};

export default Items;
