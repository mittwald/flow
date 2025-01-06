/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TooltipProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipProps } from "@mittwald/flow-react-components/Tooltip";

export class RemoteTooltipElement extends FlowRemoteElement<TooltipProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      style: {},
      className: {},
      isOpen: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      triggerRef: {},
      arrowBoundaryOffset: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      defaultOpen: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-tooltip": InstanceType<typeof RemoteTooltipElement>;
  }
}

customElements.define("flr-tooltip", RemoteTooltipElement);
