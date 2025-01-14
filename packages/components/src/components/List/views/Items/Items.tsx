import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Items.module.css";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import type { ListSupportedComponentProps } from "~/components/List/model/types";

export interface ItemsProps
  extends PropsWithChildren,
    ListSupportedComponentProps {
  isLoading?: boolean;
  isInitiallyLoading?: boolean;
}

/** @flr-generate all */
export const Items: FC<ItemsProps> = (props) => {
  const { isInitiallyLoading, isLoading, children, ...componentProps } = props;

  const rootClassName = clsx(styles.items, isLoading && styles.isLoading);

  return (
    <div aria-hidden={isInitiallyLoading} aria-busy={isLoading}>
      <Aria.GridList
        className={rootClassName}
        {...componentProps}
        renderEmptyState={() => null}
      >
        {isInitiallyLoading ? null : children}
      </Aria.GridList>
    </div>
  );
};

export default Items;
