/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MessageProps } from "@mittwald/flow-react-components/Message";
export type { MessageProps } from "@mittwald/flow-react-components/Message";

export class RemoteMessageElement extends FlowRemoteElement<MessageProps> {
  static get remoteProperties() {
    return {
      type: {},
      orientation: {},
      children: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-message": InstanceType<typeof RemoteMessageElement>;
  }
}

customElements.define("flr-message", RemoteMessageElement);
