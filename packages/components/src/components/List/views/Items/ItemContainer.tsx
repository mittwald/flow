import type { PropsWithChildren } from "react";
import React, { Suspense } from "react";
import styles from "./Item.module.scss";
import clsx from "clsx";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { SkeletonView } from "@/components/List/components/Items/components/Item/components/SkeletonView/SkeletonView";

export interface ItemContainerProps extends PropsWithChildren {
  id: Key;
  textValue?: string;
  href?: string;
  onAction?: () => void;
}

/** @flr-generate all */
export const ItemContainer = (props: ItemContainerProps) => {
  const { id, textValue, href, onAction, children, ...gridItemProps } = props;
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
      textValue={textValue}
      href={href}
      onAction={onAction}
      {...gridItemProps}
    >
      <Suspense fallback={<SkeletonView />}>{children}</Suspense>
    </Aria.GridListItem>
  );
};

export default ItemContainer;
