/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TruncateProps as RemoteTruncateElementProps } from "@mittwald/flow-react-components";
export type { TruncateProps as RemoteTruncateElementProps } from "@mittwald/flow-react-components";

export class RemoteTruncateElement extends FlowRemoteElement<RemoteTruncateElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      title: {},
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
    "flr-truncate": InstanceType<typeof RemoteTruncateElement>;
  }
}

customElements.define("flr-truncate", RemoteTruncateElement);
