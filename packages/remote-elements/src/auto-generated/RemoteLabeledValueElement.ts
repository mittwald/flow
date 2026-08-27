/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { LabeledValueProps } from "@mittwald/flow-react-components";
export type RemoteLabeledValueElementProps =
  WithSerializableClassName<LabeledValueProps>;

export class RemoteLabeledValueElement extends FlowRemoteElement<RemoteLabeledValueElementProps> {
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
    "flr-labeled-value": InstanceType<typeof RemoteLabeledValueElement>;
  }
}

customElements.define("flr-labeled-value", RemoteLabeledValueElement);
