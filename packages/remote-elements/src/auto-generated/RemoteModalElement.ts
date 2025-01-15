/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps as RemoteModalElementProps } from "@mittwald/flow-react-components/Modal";

export class RemoteModalElement extends FlowRemoteElement<RemoteModalElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      controller: {},
      isDismissable: {},
      offCanvas: {},
      offCanvasOrientation: {},
      size: {},
      slot: {},
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
    "flr-modal": InstanceType<typeof RemoteModalElement>;
  }
}

customElements.define("flr-modal", RemoteModalElement);
