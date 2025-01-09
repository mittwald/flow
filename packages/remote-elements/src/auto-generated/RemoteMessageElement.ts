/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MessageProps as RemoteMessageElementProps } from "@mittwald/flow-react-components/Message";
export type { MessageProps as RemoteMessageElementProps } from "@mittwald/flow-react-components/Message";

export class RemoteMessageElement extends FlowRemoteElement<RemoteMessageElementProps> {
  static get remoteProperties() {
    return {
      type: {},
      orientation: {},
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
    "flr-message": InstanceType<typeof RemoteMessageElement>;
  }
}

customElements.define("flr-message", RemoteMessageElement);
