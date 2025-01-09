/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";

export class RemoteModalElement extends FlowRemoteElement<RemoteModalElementProps> {
  static get remoteProperties() {
    return {
      size: {},
      offCanvas: {},
      offCanvasOrientation: {},
      controller: {},
      slot: {},
      isDismissable: {},
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
