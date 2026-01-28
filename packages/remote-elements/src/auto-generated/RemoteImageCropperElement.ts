/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ImageCropperProps as RemoteImageCropperElementProps } from "@mittwald/flow-react-components";
export type { ImageCropperProps as RemoteImageCropperElementProps } from "@mittwald/flow-react-components";

export class RemoteImageCropperElement extends FlowRemoteElement<RemoteImageCropperElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      aspect: {},
      className: {},
      cropShape: {},
      height: {},
      image: {},
      width: {},
    };
  }

  static override get remoteEvents() {
    return {
      cropComplete: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-image-cropper": InstanceType<typeof RemoteImageCropperElement>;
  }
}

customElements.define("flr-image-cropper", RemoteImageCropperElement);
