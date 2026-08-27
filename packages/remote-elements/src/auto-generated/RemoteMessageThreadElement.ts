/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { MessageThreadProps } from "@mittwald/flow-react-components";
export type RemoteMessageThreadElementProps =
  WithSerializableClassName<MessageThreadProps>;

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
