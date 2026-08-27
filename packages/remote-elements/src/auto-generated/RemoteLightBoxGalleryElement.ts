/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxGalleryProps as RemoteLightBoxGalleryElementProps } from "@mittwald/flow-react-components";
export type { LightBoxGalleryProps as RemoteLightBoxGalleryElementProps } from "@mittwald/flow-react-components";

export class RemoteLightBoxGalleryElement extends FlowRemoteElement<RemoteLightBoxGalleryElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      defaultIndex: {},
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
    "flr-light-box-gallery": InstanceType<typeof RemoteLightBoxGalleryElement>;
  }
}

customElements.define("flr-light-box-gallery", RemoteLightBoxGalleryElement);
