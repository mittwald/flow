import React from "react";
import type * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Popover, type PopoverProps } from "@/components/Popover";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { MenuItemProps } from "@/components/MenuItem";
import { useOverlayController } from "@/lib/controller";
import { OverlayContextProvider } from "@/lib/controller/overlay/OverlayContextProvider";
import { Action } from "@/components/Action";
import type { ContextMenuSelectionMode } from "@/components/ContextMenu/lib";
import {
  getAriaSelectionMode,
  getCloseOverlayType,
  getMenuItemSelectionVariant,
} from "@/components/ContextMenu/lib";
import ContextMenuContentView from "@/views/ContextMenuContentView";

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
  /** The type of selection that is allowed in the context menu. */
  selectionMode?: ContextMenuSelectionMode;
  /** Sets the context menu to a fixed width. */
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
    ref,
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
          <ContextMenuContentView
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
          </ContextMenuContentView>
        </OverlayContextProvider>
      </Popover>
    </ClearPropsContext>
  );
});

export default ContextMenu;
