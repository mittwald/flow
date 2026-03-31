import * as Aria from "react-aria-components";
import type { FC } from "react";
import styles from "@/components/List/components/Items/components/Item/Item.module.scss";
import clsx from "clsx";

export type ListBoxItemProps = Aria.ListBoxItemProps<never> & {
  hasAction?: boolean;
  isTile?: boolean;
};

/** @flr-generate all */
export const ListBoxItem: FC<ListBoxItemProps> = (props) => {
  const { hasAction, isTile, ...restProps } = props;
  return (
    <Aria.ListBoxItem
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

export default ListBoxItem;
