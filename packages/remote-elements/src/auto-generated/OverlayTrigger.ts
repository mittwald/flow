/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { OverlayTriggerProps } from "@mittwald/flow-react-components/OverlayTrigger";
export type { OverlayTriggerProps } from "@mittwald/flow-react-components/OverlayTrigger";

export class RemoteOverlayTriggerElement extends FlowRemoteElement<OverlayTriggerProps> {
  static get remoteProperties() {
    return {
      overlayType: {},
      component: {},
      isDefaultOpen: {},
      controller: {},
      wrapWith: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-overlay-trigger": InstanceType<typeof RemoteOverlayTriggerElement>;
  }
}

customElements.define("flr-overlay-trigger", RemoteOverlayTriggerElement);
