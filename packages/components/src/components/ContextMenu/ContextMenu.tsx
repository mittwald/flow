import React from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import { ContextMenuItemProps } from "@/components/ContextMenu/components/ContextMenuItem";
import { Popover, PopoverProps } from "@/components/Popover";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface ContextMenuProps
  extends PopoverProps,
    Pick<Aria.MenuProps<ContextMenuItemProps>, "onAction">,
    FlowComponentProps {}

export const ContextMenu = flowComponent("ContextMenu", (props) => {
  const { children, onAction, ...rest } = props;

  return (
    <Popover {...rest}>
      <Aria.Menu className={styles.contextMenu} onAction={onAction}>
        {children}
      </Aria.Menu>
    </Popover>
  );
});

export default ContextMenu;
