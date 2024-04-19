import React from "react";
import * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import type { MenuItemProps } from "src/components/MenuItem";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PopoverProps } from "@/components/Popover";
import { Popover } from "@/components/Popover";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { ClearPropsContext } from "@/lib/propsContext";

export interface ContextMenuProps
  extends PopoverProps,
    Pick<
      Aria.MenuProps<MenuItemProps>,
      "onAction" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange"
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
    onSelectionChange,
    ref,
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
      <Popover {...rest}>
        <Aria.Menu
          className={styles.contextMenu}
          onAction={onAction}
          selectionMode={ariaSelectionMode}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
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
