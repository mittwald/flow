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
import type { ContextMenuSelectionMode } from "@/components/ContextMenu/lib";
import {
  getAriaSelectionMode,
  getCloseOverlayType,
  getMenuItemSelectionVariant,
} from "@/components/ContextMenu/lib";

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
  selectionMode?: ContextMenuSelectionMode;
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

  const selectionVariant = getMenuItemSelectionVariant(selectionMode);

  const propsContext: PropsContext = {
    MenuItem: {
      selectionVariant,
      Avatar: {
        size: "l",
      },
    },

    Section: {
      MenuItem: {
        Avatar: {
          size: "l",
        },
      },
      renderContextMenuSection: true,
    },

    ContextMenuSection: {
      MenuItem: {
        Avatar: {
          size: "l",
        },
      },
    },
  };

  return (
    <ClearPropsContext>
      <Popover
        {...rest}
        controller={overlayController}
        isDialogContent={false}
        padding="s"
      >
        <OverlayContextProvider
          type="ContextMenu"
          controller={overlayController}
        >
          <Aria.Menu
            className={styles.contextMenu}
            onAction={onAction}
            selectionMode={getAriaSelectionMode(selectionMode)}
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            disabledKeys={disabledKeys}
            onSelectionChange={onSelectionChange}
            ref={ref}
          >
            <PropsContextProvider props={propsContext}>
              <Action closeOverlay={getCloseOverlayType(selectionMode)}>
                {children}
              </Action>
            </PropsContextProvider>
          </Aria.Menu>
        </OverlayContextProvider>
      </Popover>
    </ClearPropsContext>
  );
});

export default ContextMenu;
