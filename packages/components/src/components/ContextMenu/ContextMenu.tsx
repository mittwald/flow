import React from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PopoverProps } from "@/components/Popover";
import { Popover } from "@/components/Popover";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { MenuItemProps } from "@/components/MenuItem";

export interface ContextMenuProps
  extends PopoverProps,
    Pick<
      Aria.MenuProps<MenuItemProps>,
      | "onAction"
      | "selectedKeys"
      | "defaultSelectedKeys"
      | "onSelectionChange"
      | "disabledKeys"
    >,
    FlowComponentProps {
  selectionMode?: "single" | "multiple" | "navigation";
}

export const ContextMenu = flowComponent("ContextMenu", (props) => {
  const {
    children,
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    disabledKeys,
    onSelectionChange,
    refProp: ref,
    ...rest
  } = props;

  const ariaSelectionMode =
    selectionMode === "navigation" ? "single" : selectionMode;

  const propsContext: PropsContext = {
    MenuItem: {
      selectionVariant:
        selectionMode === "navigation" ? "navigation" : "control",
    },
  };

  return (
    <ClearPropsContext>
      <Popover {...rest} className={styles.popover}>
        <Aria.Menu
          className={styles.contextMenu}
          onAction={onAction}
          selectionMode={ariaSelectionMode}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          disabledKeys={disabledKeys}
          onSelectionChange={onSelectionChange}
          ref={ref}
        >
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Aria.Menu>
      </Popover>
    </ClearPropsContext>
  );
});

export default ContextMenu;
