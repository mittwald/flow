/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ModalTriggerProps } from "@mittwald/flow-react-components/ModalTrigger";
export type { ModalTriggerProps } from "@mittwald/flow-react-components/ModalTrigger";

export class RemoteModalTriggerElement extends FlowRemoteElement<ModalTriggerProps> {
  static get remoteProperties() {
    return {
      isDefaultOpen: {},
      controller: {},
      wrapWith: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-modal-trigger": InstanceType<typeof RemoteModalTriggerElement>;
  }
}

customElements.define("flr-modal-trigger", RemoteModalTriggerElement);
