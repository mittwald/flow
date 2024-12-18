/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { MenuItemContentProps } from "@mittwald/flow-react-components/MenuItemContent";
export type { MenuItemContentProps } from "@mittwald/flow-react-components/MenuItemContent";

export const RemoteMenuItemContentElement =
  createRemoteElement<MenuItemContentProps>({
    properties: {
      selectionVariant: {},
      hasSubmenu: {},
      isOpen: {},
      isHovered: {},
      isPressed: {},
      isSelected: {},
      isFocused: {},
      isFocusVisible: {},
      isDisabled: {},
      selectionMode: {},
      selectionBehavior: {},
      allowsDragging: {},
      isDragging: {},
      isDropTarget: {},
      children: {},
    },
    events: {},
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-menu-item-content": InstanceType<typeof RemoteMenuItemContentElement>;
  }
}

customElements.define("flr-menu-item-content", RemoteMenuItemContentElement);
