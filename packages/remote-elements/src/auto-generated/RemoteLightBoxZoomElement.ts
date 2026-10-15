/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxZoomProps as RemoteLightBoxZoomElementProps } from "@mittwald/flow-react-components";
export type { LightBoxZoomProps as RemoteLightBoxZoomElementProps } from "@mittwald/flow-react-components";

export class RemoteLightBoxZoomElement extends FlowRemoteElement<RemoteLightBoxZoomElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-light-box-zoom": InstanceType<typeof RemoteLightBoxZoomElement>;
  }
}

customElements.define("flr-light-box-zoom", RemoteLightBoxZoomElement);
