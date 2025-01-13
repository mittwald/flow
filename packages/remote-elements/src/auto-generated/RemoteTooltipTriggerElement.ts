/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipTriggerProps as RemoteTooltipTriggerElementProps } from "@mittwald/flow-react-components/Tooltip";

export class RemoteTooltipTriggerElement extends FlowRemoteElement<RemoteTooltipTriggerElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      closeDelay: {},
      defaultOpen: {},
      delay: {},
      isDisabled: {},
      isOpen: {},
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
    "flr-tooltip-trigger": InstanceType<typeof RemoteTooltipTriggerElement>;
  }
}

customElements.define("flr-tooltip-trigger", RemoteTooltipTriggerElement);
