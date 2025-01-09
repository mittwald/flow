/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PopoverProps as RemotePopoverElementProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverProps as RemotePopoverElementProps } from "@mittwald/flow-react-components/Popover";

export class RemotePopoverElement extends FlowRemoteElement<RemotePopoverElementProps> {
  static get remoteProperties() {
    return {
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
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover": InstanceType<typeof RemotePopoverElement>;
  }
}

customElements.define("flr-popover", RemotePopoverElement);
