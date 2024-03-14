import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenuItem.module.scss";

export interface ContextMenuItemProps extends Aria.MenuItemProps {}

export const ContextMenuItem: FC<ContextMenuItemProps> = (props) => {
  const { children, ...rest } = props;

  return (
    <Aria.MenuItem {...rest} className={styles.contextMenuItem}>
      {children}
    </Aria.MenuItem>
  );
};

export default ContextMenuItem;
