import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenuItem.module.scss";
import clsx from "clsx";

export interface ContextMenuItemProps extends Aria.MenuItemProps {}

export const ContextMenuItem: FC<ContextMenuItemProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.contextMenuItem, className);

  return (
    <Aria.MenuItem {...rest} className={rootClassName}>
      {children}
    </Aria.MenuItem>
  );
};

export default ContextMenuItem;
