/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuElement extends FlowRemoteElement<RemoteContextMenuElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
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

  static override get remoteEvents() {
    return {
      action: {},
      openChange: {},
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu": InstanceType<typeof RemoteContextMenuElement>;
  }
}

customElements.define("flr-context-menu", RemoteContextMenuElement);
