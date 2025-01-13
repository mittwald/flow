/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuElement extends FlowRemoteElement<RemoteContextMenuElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      arrowBoundaryOffset: {},
      boundaryElement: {},
      containerPadding: {},
      controller: {},
      crossOffset: {},
      defaultOpen: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
      isDialogContent: {},
      isEntering: {},
      isExiting: {},
      isKeyboardDismissDisabled: {},
      isNonModal: {},
      isOpen: {},
      maxHeight: {},
      offset: {},
      padding: {},
      placement: {},
      scrollRef: {},
      selectedKeys: {},
      selectionMode: {},
      shouldCloseOnInteractOutside: {},
      shouldFlip: {},
      shouldUpdatePosition: {},
      slot: {},
      trigger: {},
      triggerRef: {},
      width: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
      openChange: {},
      selectionChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu": InstanceType<typeof RemoteContextMenuElement>;
  }
}

customElements.define("flr-context-menu", RemoteContextMenuElement);
