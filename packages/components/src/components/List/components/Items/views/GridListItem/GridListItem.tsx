import * as Aria from "react-aria-components";
import type { FC } from "react";
import styles from "@/components/List/components/Items/components/Item/Item.module.scss";
import clsx from "clsx";

export type GridListItemProps = Aria.GridListItemProps<never> & {
  hasAction?: boolean;
  isTile?: boolean;
};

/** @flr-generate all */
export const GridListItem: FC<GridListItemProps> = (props) => {
  const { hasAction, isTile, ...restProps } = props;
  return (
    <Aria.GridListItem
      {...restProps}
      className={(renderProps) =>
        clsx(
          styles.item,
          hasAction && styles.hasAction,
          isTile && styles.tile,
          renderProps.isSelected && styles.isSelected,
        )
      }
    />
  );
};

export default GridListItem;
