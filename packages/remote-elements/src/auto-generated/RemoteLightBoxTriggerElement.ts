/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxTriggerProps as RemoteLightBoxTriggerElementProps } from "@mittwald/flow-react-components/LightBox";
export type { LightBoxTriggerProps as RemoteLightBoxTriggerElementProps } from "@mittwald/flow-react-components/LightBox";

export class RemoteLightBoxTriggerElement extends FlowRemoteElement<RemoteLightBoxTriggerElementProps> {
  static get remoteProperties() {
    return {
      controller: {},
      isDefaultOpen: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-light-box-trigger": InstanceType<typeof RemoteLightBoxTriggerElement>;
  }
}

customElements.define("flr-light-box-trigger", RemoteLightBoxTriggerElement);
