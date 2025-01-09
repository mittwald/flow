/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxProps as RemoteLightBoxElementProps } from "@mittwald/flow-react-components/LightBox";
export type { LightBoxProps as RemoteLightBoxElementProps } from "@mittwald/flow-react-components/LightBox";

export class RemoteLightBoxElement extends FlowRemoteElement<RemoteLightBoxElementProps> {
  static get remoteProperties() {
    return {
      controller: {},
      fitScreen: {},
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
    "flr-light-box": InstanceType<typeof RemoteLightBoxElement>;
  }
}

customElements.define("flr-light-box", RemoteLightBoxElement);
