/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { PopoverTriggerProps as RemotePopoverTriggerElementProps } from "@mittwald/flow-react-components/Popover";
export type { PopoverTriggerProps as RemotePopoverTriggerElementProps } from "@mittwald/flow-react-components/Popover";

export class RemotePopoverTriggerElement extends FlowRemoteElement<RemotePopoverTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      controller: {},
      isDefaultOpen: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-popover-trigger": InstanceType<typeof RemotePopoverTriggerElement>;
  }
}

customElements.define("flr-popover-trigger", RemotePopoverTriggerElement);
