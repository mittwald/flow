/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components";
export type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteTooltipTriggerElement extends FlowRemoteElement<RemoteTooltipTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      closeDelay: {},
      defaultOpen: {},
      delay: {},
      isDisabled: {},
      isOpen: {},
      shouldCloseOnPress: {},
      trigger: {},
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
    "flr-tooltip-trigger": InstanceType<typeof RemoteTooltipTriggerElement>;
  }
}

customElements.define("flr-tooltip-trigger", RemoteTooltipTriggerElement);
