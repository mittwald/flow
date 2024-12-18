/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { PopoverProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverProps } from "@mittwald/flow-react-components/Popover";

export const RemotePopoverElement = createRemoteElement<PopoverProps>({
  properties: {
    withTip: {},
    isDialogContent: {},
    controller: {},
    width: {},
    padding: {},
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
    children: {},
    ref: {},
    key: {},
  },
  events: {
    openChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover": InstanceType<typeof RemotePopoverElement>;
  }
}

customElements.define("flr-popover", RemotePopoverElement);
