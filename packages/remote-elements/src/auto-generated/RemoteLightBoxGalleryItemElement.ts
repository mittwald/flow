/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxGalleryItemProps as RemoteLightBoxGalleryItemElementProps } from "@mittwald/flow-react-components";
export type { LightBoxGalleryItemProps as RemoteLightBoxGalleryItemElementProps } from "@mittwald/flow-react-components";

export class RemoteLightBoxGalleryItemElement extends FlowRemoteElement<RemoteLightBoxGalleryItemElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-light-box-gallery-item": InstanceType<
      typeof RemoteLightBoxGalleryItemElement
    >;
  }
}

customElements.define(
  "flr-light-box-gallery-item",
  RemoteLightBoxGalleryItemElement,
);
