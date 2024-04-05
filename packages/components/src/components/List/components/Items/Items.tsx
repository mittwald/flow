import type { FC } from "react";
import React, { Suspense } from "react";
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
  const isLoading = list.loader.useIsLoading();

  const rows = list.items.entries.map((i) => (
    <Item key={i.id}>
      <Suspense>{i.render()}</Suspense>
    </Item>
  ));

  const rootClassName = clsx(
    styles.items,
    className,
    isLoading && styles.isLoading,
  );

  return <div className={rootClassName}>{rows}</div>;
};

export default Items;
