/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { GalleryProps as RemoteGalleryElementProps } from "@mittwald/flow-react-components";
export type { GalleryProps as RemoteGalleryElementProps } from "@mittwald/flow-react-components";

export class RemoteGalleryElement extends FlowRemoteElement<RemoteGalleryElementProps> {
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
    "flr-gallery": InstanceType<typeof RemoteGalleryElement>;
  }
}

customElements.define("flr-gallery", RemoteGalleryElement);
