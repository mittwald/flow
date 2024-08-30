import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Item.module.scss";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import { useList } from "@/components/List/hooks/useList";

interface Props extends PropsWithChildren {
  data: never;
}

export const Item = (props: Props) => {
  const { data, children } = props;
  const list = useList();
  const itemView = list.itemView;

  if (!itemView) {
    return null;
  }

  const onAction = itemView.list.onAction;

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;
  const hasAction = !!onAction || !!href;

  const rootClassName = clsx(styles.item, hasAction && styles.hasAction);

  return (
    <Aria.GridListItem
      className={rootClassName}
      onAction={() => onAction && onAction(data)}
      textValue={textValue}
      href={href}
    >
      {children ?? itemView.render(data)}
    </Aria.GridListItem>
  );
};

export const ItemContainer: FC<PropsWithChildren> = (props) => (
  <Aria.GridListItem textValue="-" className={styles.item}>
    {props.children}
  </Aria.GridListItem>
);

export default Item;
