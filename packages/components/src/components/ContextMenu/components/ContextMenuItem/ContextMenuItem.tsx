import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenuItem.module.scss";
import clsx from "clsx";
import { ContextMenuItemContent } from "@/components/ContextMenu/components/ContextMenuItem/ContextMenuItemContent";

export interface ContextMenuItemProps
  extends Omit<Aria.MenuItemProps, "children">,
    PropsWithChildren {}

export const ContextMenuItem: FC<ContextMenuItemProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.contextMenuItem, className);

  return (
    <Aria.MenuItem {...rest} className={rootClassName}>
      {(props) => (
        <ContextMenuItemContent {...props}>{children}</ContextMenuItemContent>
      )}
    </Aria.MenuItem>
  );
};

export default ContextMenuItem;
