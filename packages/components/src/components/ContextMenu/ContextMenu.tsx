import React, { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import { ContextMenuItemProps } from "@/components/ContextMenu/components/ContextMenuItem";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface ContextMenuProps
  extends Omit<Aria.PopoverProps, "children">,
    Pick<Aria.MenuProps<ContextMenuItemProps>, "onAction">,
    PropsWithChildren,
    FlowComponentProps {}

export const ContextMenu = flowComponent("ContextMenu", (props) => {
  const { children, onAction, ...rest } = props;

  return (
    <Aria.Popover className={styles.contextMenu} {...rest}>
      <Aria.Menu className={styles.menuList} onAction={onAction}>
        {children}
      </Aria.Menu>
    </Aria.Popover>
  );
});

export default ContextMenu;
