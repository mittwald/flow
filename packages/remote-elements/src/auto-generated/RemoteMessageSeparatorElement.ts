/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MessageSeparatorProps as RemoteMessageSeparatorElementProps } from "@mittwald/flow-react-components";
export type { MessageSeparatorProps as RemoteMessageSeparatorElementProps } from "@mittwald/flow-react-components";

export class RemoteMessageSeparatorElement extends FlowRemoteElement<RemoteMessageSeparatorElementProps> {
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
    "flr-message-separator": InstanceType<typeof RemoteMessageSeparatorElement>;
  }
}

customElements.define("flr-message-separator", RemoteMessageSeparatorElement);
