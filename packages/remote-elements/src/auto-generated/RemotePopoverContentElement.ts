/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { PopoverContentProps } from "@mittwald/flow-react-components";
export type RemotePopoverContentElementProps =
  WithSerializableClassName<PopoverContentProps>;

export class RemotePopoverContentElement extends FlowRemoteElement<RemotePopoverContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      isDialogContent: {},
      isOpen: {},
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
