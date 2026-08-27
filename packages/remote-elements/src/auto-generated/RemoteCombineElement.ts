/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { CombineProps } from "@mittwald/flow-react-components";
export type RemoteCombineElementProps = WithSerializableClassName<CombineProps>;

export class RemoteCombineElement extends FlowRemoteElement<RemoteCombineElementProps> {
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
    "flr-combine": InstanceType<typeof RemoteCombineElement>;
  }
}

customElements.define("flr-combine", RemoteCombineElement);
