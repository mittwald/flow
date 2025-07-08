import { Action } from "@/components/Action";
import type { ContextMenuSelectionMode } from "@/components/ContextMenu/lib";
import {
  getAriaSelectionMode,
  getCloseOverlayType,
  getMenuItemSelectionVariant,
} from "@/components/ContextMenu/lib";
import type { MenuItemProps } from "@/components/MenuItem";
import { Popover, type PopoverProps } from "@/components/Popover/Popover";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useOverlayController } from "@/lib/controller";
import { OverlayContextProvider } from "@/lib/controller/overlay/OverlayContextProvider";
import type { PropsContext } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ContextMenuContentView from "@/views/ContextMenuContentView";
import type * as Aria from "react-aria-components";
import styles from "./ContextMenu.module.scss";

export interface ContextMenuProps
  extends Omit<PopoverProps, "withTip">,
    Pick<
      Aria.MenuProps<MenuItemProps>,
      | "onAction"
      | "selectedKeys"
      | "defaultSelectedKeys"
      | "onSelectionChange"
      | "disabledKeys"
      | "renderEmptyState"
    >,
    FlowComponentProps {
  /** The type of selection that is allowed in the context menu. */
  selectionMode?: ContextMenuSelectionMode;
  /** Sets the context menu to a fixed width. */
  width?: string | number;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const ContextMenu = flowComponent("ContextMenu", (props) => {
  const {
    children,
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    disabledKeys,
    onSelectionChange,
    renderEmptyState,
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
            renderEmptyState={renderEmptyState}
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
