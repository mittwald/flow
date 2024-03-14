import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import { ContextMenuItemProps } from "@/components/ContextMenu/components/ContextMenuItem";

export interface ContextMenuProps
  extends Omit<Aria.PopoverProps, "children">,
    Pick<Aria.MenuProps<ContextMenuItemProps>, "onAction">,
    PropsWithChildren {}

export const ContextMenu: FC<ContextMenuProps> = (props) => {
  const { children, onAction } = props;

  return (
    <Aria.Popover className={styles.contextMenu}>
      <Aria.Menu onAction={onAction}>{children}</Aria.Menu>
    </Aria.Popover>
  );
};

export default ContextMenu;
