/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { LightBoxProps as RemoteLightBoxElementProps } from "@mittwald/flow-react-components/LightBox";
export type { LightBoxProps as RemoteLightBoxElementProps } from "@mittwald/flow-react-components/LightBox";

export class RemoteLightBoxElement extends FlowRemoteElement<RemoteLightBoxElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      controller: {},
      fitScreen: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-light-box": InstanceType<typeof RemoteLightBoxElement>;
  }
}

customElements.define("flr-light-box", RemoteLightBoxElement);
