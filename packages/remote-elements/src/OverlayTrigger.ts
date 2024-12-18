/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { OverlayTriggerProps } from "@mittwald/flow-react-components/OverlayTrigger";
export type { OverlayTriggerProps } from "@mittwald/flow-react-components/OverlayTrigger";

export const RemoteOverlayTriggerElement =
  createRemoteElement<OverlayTriggerProps>({
    properties: {
      overlayType: {},
      component: {},
      isDefaultOpen: {},
      children: {},
      controller: {},
      wrapWith: {},
    },
    events: {},
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-overlay-trigger": InstanceType<typeof RemoteOverlayTriggerElement>;
  }
}

customElements.define("flr-overlay-trigger", RemoteOverlayTriggerElement);
