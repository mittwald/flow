/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ContextMenuProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuProps } from "@mittwald/flow-react-components/ContextMenu";

export const RemoteContextMenuElement = createRemoteElement<ContextMenuProps>({
  properties: {
    selectionMode: {},
    width: {},
    children: {},
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
    className: {},
    style: {},
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
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {
    openChange: {},
    action: {},
    selectionChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu": InstanceType<typeof RemoteContextMenuElement>;
  }
}

customElements.define("flr-context-menu", RemoteContextMenuElement);
