/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MenuItemContentProps } from "@mittwald/flow-react-components/MenuItemContent";
export type { MenuItemContentProps } from "@mittwald/flow-react-components/MenuItemContent";

export class RemoteMenuItemContentElement extends FlowRemoteElement<MenuItemContentProps> {
  static get remoteProperties() {
    return {
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
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-menu-item-content": InstanceType<typeof RemoteMenuItemContentElement>;
  }
}

customElements.define("flr-menu-item-content", RemoteMenuItemContentElement);
