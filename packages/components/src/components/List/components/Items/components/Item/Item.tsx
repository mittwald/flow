import type { FC, PropsWithChildren } from "react";
import React, { Suspense } from "react";
import styles from "./Item.module.scss";
import clsx from "clsx";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { useList } from "@/components/List/hooks/useList";
import { SkeletonView } from "@/components/List/components/Items/components/Item/components/SkeletonView/SkeletonView";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
}

export const Item = (props: Props) => {
  const { id, data, children } = props;
  const list = useList();
  const itemView = list.itemView;

  if (!itemView) {
    return null;
  }

  const onAction = itemView.list.onAction;

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;
  const hasAction = !!onAction || !!href;

  return (
    <Aria.GridListItem
      id={id}
      className={(props) =>
        clsx(
          styles.item,
          hasAction && styles.hasAction,
          props.isSelected && styles.isSelected,
        )
      }
      onAction={() => onAction && onAction(data)}
      textValue={textValue}
      href={href}
    >
      <Suspense fallback={<SkeletonView />}>
        {children ?? itemView.render(data)}
      </Suspense>
    </Aria.GridListItem>
  );
};

export const ItemContainer: FC<PropsWithChildren> = (props) => (
  <Aria.GridListItem textValue="-" className={styles.item}>
    {props.children}
  </Aria.GridListItem>
);

export default Item;
