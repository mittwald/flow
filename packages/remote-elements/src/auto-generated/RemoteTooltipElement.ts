/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";

export class RemoteTooltipElement extends FlowRemoteElement<RemoteTooltipElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      arrowBoundaryOffset: {},
      containerPadding: {},
      crossOffset: {},
      defaultOpen: {},
      isEntering: {},
      isExiting: {},
      isOpen: {},
      offset: {},
      placement: {},
      shouldFlip: {},
      triggerRef: {},
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
    "flr-tooltip": InstanceType<typeof RemoteTooltipElement>;
  }
}

customElements.define("flr-tooltip", RemoteTooltipElement);
