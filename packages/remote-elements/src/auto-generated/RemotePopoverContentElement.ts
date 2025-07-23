/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PopoverContentProps as RemotePopoverContentElementProps } from "@mittwald/flow-react-components";
export type { PopoverContentProps as RemotePopoverContentElementProps } from "@mittwald/flow-react-components";

export class RemotePopoverContentElement extends FlowRemoteElement<RemotePopoverContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      isDialogContent: {},
      isOpen: {},
      padding: {},
      triggerRef: {},
      width: {},
      withTip: {},
    };
  }

  static override get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover-content": InstanceType<typeof RemotePopoverContentElement>;
  }
}

customElements.define("flr-popover-content", RemotePopoverContentElement);
