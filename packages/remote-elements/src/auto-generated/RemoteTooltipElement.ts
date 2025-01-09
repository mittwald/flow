/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";

export class RemoteTooltipElement extends FlowRemoteElement<RemoteTooltipElementProps> {
  static get remoteProperties() {
    return {
      arrowBoundaryOffset: {},
      triggerRef: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      isOpen: {},
      defaultOpen: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
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
