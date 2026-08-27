/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { AlignProps } from "@mittwald/flow-react-components";
export type RemoteAlignElementProps = WithSerializableClassName<AlignProps>;

export class RemoteAlignElement extends FlowRemoteElement<RemoteAlignElementProps> {
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
    "flr-align": InstanceType<typeof RemoteAlignElement>;
  }
}

customElements.define("flr-align", RemoteAlignElement);
