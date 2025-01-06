/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuElement extends FlowRemoteElement<ContextMenuProps> {
  static get remoteProperties() {
    return {
      selectionMode: {},
      width: {},
      children: {},
      style: {},
      className: {},
      slot: {},
      isOpen: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      triggerRef: {},
      boundaryElement: {},
      scrollRef: {},
      shouldUpdatePosition: {},
      maxHeight: {},
      arrowBoundaryOffset: {},
      isNonModal: {},
      isKeyboardDismissDisabled: {},
      shouldCloseOnInteractOutside: {},
      trigger: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      defaultOpen: {},
      isDialogContent: {},
      controller: {},
      padding: {},
      selectedKeys: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
      action: {},
      selectionChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu": InstanceType<typeof RemoteContextMenuElement>;
  }
}

customElements.define("flr-context-menu", RemoteContextMenuElement);
