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
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import { Action } from "@/components/Action";

export interface ContextMenuProps
  extends Omit<PopoverProps, "withTip">,
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
  width?: string | number;
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
    controller: overlayControllerFromProps,
    ...rest
  } = props;

  const overlayControllerFromContext = useOverlayController("ContextMenu", {
    reuseControllerFromContext: true,
  });

  const overlayController =
    overlayControllerFromProps ?? overlayControllerFromContext;

  const ariaSelectionMode =
    selectionMode === "navigation" ? "none" : selectionMode;

  const selectionVariant =
    selectionMode === "navigation" ? "navigation" : "control";

  const propsContext: PropsContext = {
    MenuItem: {
      selectionVariant,
    },

    Section: {
      MenuItem: {
        selectionVariant,
      },
      renderContextMenuSection: true,
    },
  };

  const closeOverlayType =
    selectionMode === "single" || selectionMode === "navigation"
      ? "ContextMenu"
      : undefined;

  return (
    <ClearPropsContext>
      <Popover
        {...rest}
        contentClassName={styles.popoverContent}
        controller={overlayController}
        isDialogContent={false}
      >
        <OverlayContextProvider
          type="ContextMenu"
          controller={overlayController}
        >
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
              <Action closeOverlay={closeOverlayType}>{children}</Action>
            </PropsContextProvider>
          </Aria.Menu>
        </OverlayContextProvider>
      </Popover>
    </ClearPropsContext>
  );
});

export default ContextMenu;
