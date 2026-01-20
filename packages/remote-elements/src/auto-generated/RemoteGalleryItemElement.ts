/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { GalleryItemProps as RemoteGalleryItemElementProps } from "@mittwald/flow-react-components";
export type { GalleryItemProps as RemoteGalleryItemElementProps } from "@mittwald/flow-react-components";

export class RemoteGalleryItemElement extends FlowRemoteElement<RemoteGalleryItemElementProps> {
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
    "flr-gallery-item": InstanceType<typeof RemoteGalleryItemElement>;
  }
}

customElements.define("flr-gallery-item", RemoteGalleryItemElement);
