/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MessageProps as RemoteMessageElementProps } from "@mittwald/flow-react-components";
export type { MessageProps as RemoteMessageElementProps } from "@mittwald/flow-react-components";

export class RemoteMessageElement extends FlowRemoteElement<RemoteMessageElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      color: {},
      type: {},
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
    "flr-message": InstanceType<typeof RemoteMessageElement>;
  }
}

customElements.define("flr-message", RemoteMessageElement);
