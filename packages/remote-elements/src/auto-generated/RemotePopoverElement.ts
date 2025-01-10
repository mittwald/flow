/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PopoverProps as RemotePopoverElementProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverProps as RemotePopoverElementProps } from "@mittwald/flow-react-components/Popover";

export class RemotePopoverElement extends FlowRemoteElement<RemotePopoverElementProps> {
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
      shouldCloseOnInteractOutside: {},
      shouldFlip: {},
      shouldUpdatePosition: {},
      slot: {},
      trigger: {},
      triggerRef: {},
      width: {},
      withTip: {},
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
