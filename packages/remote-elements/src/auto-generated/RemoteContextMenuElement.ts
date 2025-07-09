/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components";
export type { ContextMenuProps as RemoteContextMenuElementProps } from "@mittwald/flow-react-components";

export class RemoteContextMenuElement extends FlowRemoteElement<RemoteContextMenuElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      arrowBoundaryOffset: {},
      boundaryElement: {},
      className: {},
      containerPadding: {},
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
      renderEmptyState: {},
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
