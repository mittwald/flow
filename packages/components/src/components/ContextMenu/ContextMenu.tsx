import React from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import type { ContextMenuItemProps } from "@/components/ContextMenu/components/ContextMenuItem";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PopoverProps } from "@/components/Popover";
import { Popover } from "@/components/Popover";

export interface ContextMenuProps
  extends PopoverProps,
    Pick<
      Aria.MenuProps<ContextMenuItemProps>,
      | "onAction"
      | "selectionMode"
      | "selectedKeys"
      | "defaultSelectedKeys"
      | "onSelectionChange"
    >,
    FlowComponentProps {}

export const ContextMenu = flowComponent("ContextMenu", (props) => {
  const {
    children,
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    ref,
    ...rest
  } = props;

  return (
    <Popover {...rest}>
      <Aria.Menu
        className={styles.contextMenu}
        onAction={onAction}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        ref={ref}
      >
        {children}
      </Aria.Menu>
    </Popover>
  );
});

export default ContextMenu;
