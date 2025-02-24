/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ChatProps as RemoteChatElementProps } from "@mittwald/flow-react-components";
export type { ChatProps as RemoteChatElementProps } from "@mittwald/flow-react-components";

export class RemoteChatElement extends FlowRemoteElement<RemoteChatElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      height: {},
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
    "flr-chat": InstanceType<typeof RemoteChatElement>;
  }
}

customElements.define("flr-chat", RemoteChatElement);
