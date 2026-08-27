/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { TruncateProps } from "@mittwald/flow-react-components";
export type RemoteTruncateElementProps =
  WithSerializableClassName<TruncateProps>;

export class RemoteTruncateElement extends FlowRemoteElement<RemoteTruncateElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      ellipsis: {},
      offset: {},
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
