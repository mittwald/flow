import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./MenuItem.module.scss";
import clsx from "clsx";
import { MenuItemContent } from "@/components/MenuItem/MenuItemContent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface MenuItemProps
  extends Omit<Aria.MenuItemProps, "children">,
    PropsWithChildren,
    FlowComponentProps<"MenuItem"> {
  selectionVariant?: "control" | "navigation";
}

export const MenuItem = flowComponent("MenuItem", (props) => {
  const { children, className, selectionVariant, ...rest } = props;

  const rootClassName = clsx(styles.menuItem, className);

  return (
    <Aria.MenuItem {...rest} className={rootClassName}>
      {(props) => (
        <MenuItemContent {...props} selectionVariant={selectionVariant}>
          {children}
        </MenuItemContent>
      )}
    </Aria.MenuItem>
  );
});

export default MenuItem;
