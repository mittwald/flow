/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipProps as RemoteTooltipElementProps } from "@mittwald/flow-react-components/Tooltip";

export class RemoteTooltipElement extends FlowRemoteElement<RemoteTooltipElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      arrowBoundaryOffset: {},
      className: {},
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
    "flr-tooltip": InstanceType<typeof RemoteTooltipElement>;
  }
}

customElements.define("flr-tooltip", RemoteTooltipElement);
