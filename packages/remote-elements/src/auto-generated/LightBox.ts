/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxProps } from "@mittwald/flow-react-components/LightBox";
export type { LightBoxProps } from "@mittwald/flow-react-components/LightBox";

export class RemoteLightBoxElement extends FlowRemoteElement<LightBoxProps> {
  static get remoteProperties() {
    return {
      controller: {},
      fitScreen: {},
      children: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-light-box": InstanceType<typeof RemoteLightBoxElement>;
  }
}

customElements.define("flr-light-box", RemoteLightBoxElement);
