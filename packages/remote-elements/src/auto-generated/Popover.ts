/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PopoverProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverProps } from "@mittwald/flow-react-components/Popover";

export class RemotePopoverElement extends FlowRemoteElement<PopoverProps> {
  static get remoteProperties() {
    return {
      withTip: {},
      isDialogContent: {},
      controller: {},
      width: {},
      padding: {},
      className: {},
      style: {},
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
      children: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover": InstanceType<typeof RemotePopoverElement>;
  }
}

customElements.define("flr-popover", RemotePopoverElement);
