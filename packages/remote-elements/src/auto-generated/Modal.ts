/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ModalProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps } from "@mittwald/flow-react-components/Modal";

export class RemoteModalElement extends FlowRemoteElement<ModalProps> {
  static get remoteProperties() {
    return {
      size: {},
      offCanvas: {},
      offCanvasOrientation: {},
      controller: {},
      slot: {},
      isDismissable: {},
      children: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-modal": InstanceType<typeof RemoteModalElement>;
  }
}

customElements.define("flr-modal", RemoteModalElement);
