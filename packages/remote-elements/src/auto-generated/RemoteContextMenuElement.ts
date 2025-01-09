/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuElement extends FlowRemoteElement<RemoteContextMenuElementProps> {
  static get remoteProperties() {
    return {
      selectionMode: {},
      width: {},
      arrowBoundaryOffset: {},
      triggerRef: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      isOpen: {},
      defaultOpen: {},
      slot: {},
      boundaryElement: {},
      scrollRef: {},
      shouldUpdatePosition: {},
      maxHeight: {},
      isNonModal: {},
      isKeyboardDismissDisabled: {},
      shouldCloseOnInteractOutside: {},
      trigger: {},
      isDialogContent: {},
      controller: {},
      padding: {},
      selectedKeys: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
      action: {},
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
