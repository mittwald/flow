/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ModalTriggerProps as RemoteModalTriggerElementProps } from "@mittwald/flow-react-components/Modal";
export type { ModalTriggerProps as RemoteModalTriggerElementProps } from "@mittwald/flow-react-components/Modal";

export class RemoteModalTriggerElement extends FlowRemoteElement<RemoteModalTriggerElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      controller: {},
      isDefaultOpen: {},
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
    "flr-modal-trigger": InstanceType<typeof RemoteModalTriggerElement>;
  }
}

customElements.define("flr-modal-trigger", RemoteModalTriggerElement);
