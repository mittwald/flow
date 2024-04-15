import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./MenuItem.module.scss";
import clsx from "clsx";
import { MenuItemContent } from "@/components/MenuItem/MenuItemContent";

export interface MenuItemProps
  extends Omit<Aria.MenuItemProps, "children">,
    PropsWithChildren {}

export const MenuItem: FC<MenuItemProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.menuItem, className);

  return (
    <Aria.MenuItem {...rest} className={rootClassName}>
      {(props) => <MenuItemContent {...props}>{children}</MenuItemContent>}
    </Aria.MenuItem>
  );
};

export default MenuItem;
