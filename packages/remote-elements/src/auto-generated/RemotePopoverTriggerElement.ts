/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PopoverTriggerProps as RemotePopoverTriggerElementProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverTriggerProps as RemotePopoverTriggerElementProps } from "@mittwald/flow-react-components/Popover";

export class RemotePopoverTriggerElement extends FlowRemoteElement<RemotePopoverTriggerElementProps> {
  static get remoteProperties() {
    return {
      isDefaultOpen: {},
      controller: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover-trigger": InstanceType<typeof RemotePopoverTriggerElement>;
  }
}

customElements.define("flr-popover-trigger", RemotePopoverTriggerElement);
