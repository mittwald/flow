import * as Aria from "react-aria-components";
import type { FC } from "react";
import styles from "@/components/List/components/Items/components/Item/Item.module.scss";
import clsx from "clsx";

export type GridListItemProps = Aria.GridListItemProps<never> & {
  hasAction?: boolean;
};

/** @flr-generate all */
export const GridListItem: FC<GridListItemProps> = (props) => {
  const { hasAction, ...restProps } = props;
  return (
    <Aria.GridListItem
      {...restProps}
      className={(props) =>
        clsx(
          styles.item,
          hasAction && styles.hasAction,
          props.isSelected && styles.isSelected,
        )
      }
    />
  );
};

export default GridListItem;
