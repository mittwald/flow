/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";

export class RemoteModalElement extends FlowRemoteElement<RemoteModalElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      controller: {},
      isDismissable: {},
      offCanvas: {},
      offCanvasOrientation: {},
      size: {},
      slot: {},
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
    "flr-modal": InstanceType<typeof RemoteModalElement>;
  }
}

customElements.define("flr-modal", RemoteModalElement);
