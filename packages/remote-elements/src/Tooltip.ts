/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TooltipProps } from "@mittwald/flow-react-components/Tooltip";
export type { TooltipProps } from "@mittwald/flow-react-components/Tooltip";

export const RemoteTooltipElement = createRemoteElement<TooltipProps>({
  properties: {
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
    className: {},
    style: {},
    children: {},
  },
  events: {
    openChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-tooltip": InstanceType<typeof RemoteTooltipElement>;
  }
}

customElements.define("flr-tooltip", RemoteTooltipElement);
