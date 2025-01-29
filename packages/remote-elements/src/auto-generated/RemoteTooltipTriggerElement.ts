/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components/Tooltip";

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
