import type { RefObject } from "react";
import React, { useCallback, useState } from "react";
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
import { useResizeObserver } from "@react-aria/utils";

export interface ContextMenuProps
  extends Omit<PopoverProps, "withTip" | "triggerRef">,
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
  /** @internal */
  closeOverlay?: boolean;
  triggerRef?: RefObject<HTMLElement>;
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
    closeOverlay,
    triggerRef,
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

  const [triggerWidth, setTriggerWidth] = useState<string>();

  const onResize = useCallback(() => {
    if (triggerRef?.current) {
      setTriggerWidth(triggerRef.current.offsetWidth + "px");
    }
  }, []);

  useResizeObserver({
    ref: triggerRef,
    onResize: onResize,
  });

  return (
    <ClearPropsContext>
      <Popover
        {...rest}
        controller={overlayController}
        isDialogContent={false}
        padding="s"
        triggerRef={triggerRef}
        style={
          { "--trigger-width": triggerWidth ?? "0" } as React.CSSProperties
        }
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
              <Action
                closeOverlay={getCloseOverlayType(selectionMode, closeOverlay)}
              >
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
