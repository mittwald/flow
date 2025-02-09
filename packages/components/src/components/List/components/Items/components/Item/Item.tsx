import type { FC, PropsWithChildren } from "react";
import React, { Suspense } from "react";
import styles from "./Item.module.scss";
import clsx from "clsx";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { useList } from "@/components/List/hooks/useList";
import { SkeletonView } from "@/components/List/components/Items/components/Item/components/SkeletonView/SkeletonView";
import { useGridItemProps } from "@/components/List/components/Items/components/Item/hooks/useGridItemProps";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
  tiles?: boolean;
}

export const Item = (props: Props) => {
  const { id, data, tiles } = props;
  const list = useList();

  const itemView = list.itemView;

  const { gridItemProps, children } = useGridItemProps(props);

  if (!itemView) {
    return null;
  }

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;
  const hasAction = !!gridItemProps.onAction || !!href;

  return (
    <Aria.GridListItem
      id={id}
      className={(props) =>
        clsx(
          styles.item,
          hasAction && styles.hasAction,
          props.isSelected && styles.isSelected,
          tiles && styles.tile,
        )
      }
      textValue={textValue}
      href={href}
      {...gridItemProps}
    >
      <Suspense fallback={<SkeletonView />}>{children}</Suspense>
    </Aria.GridListItem>
  );
};

export const ItemContainer: FC<PropsWithChildren & { tiles?: boolean }> = (
  props,
) => {
  const { tiles, children } = props;

  return (
    <Aria.GridListItem
      textValue="-"
      className={clsx(styles.item, styles.fallbackItem, tiles && styles.tile)}
    >
      {children}
    </Aria.GridListItem>
  );
};

export default Item;
