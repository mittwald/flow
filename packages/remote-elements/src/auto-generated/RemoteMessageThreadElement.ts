/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MessageThreadProps as RemoteMessageThreadElementProps } from "@mittwald/flow-react-components";
export type { MessageThreadProps as RemoteMessageThreadElementProps } from "@mittwald/flow-react-components";

export class RemoteMessageThreadElement extends FlowRemoteElement<RemoteMessageThreadElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-message-thread": InstanceType<typeof RemoteMessageThreadElement>;
  }
}

customElements.define("flr-message-thread", RemoteMessageThreadElement);
