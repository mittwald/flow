/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { DivProps } from "@mittwald/flow-react-components";
export type RemoteDivElementProps = WithSerializableClassName<DivProps>;

export class RemoteDivElement extends FlowRemoteElement<RemoteDivElementProps> {
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
    "flr-div": InstanceType<typeof RemoteDivElement>;
  }
}

customElements.define("flr-div", RemoteDivElement);
