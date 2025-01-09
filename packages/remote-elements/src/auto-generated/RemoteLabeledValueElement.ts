/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LabeledValueProps as RemoteLabeledValueElementProps } from "@mittwald/flow-react-components/LabeledValue";
export type { LabeledValueProps as RemoteLabeledValueElementProps } from "@mittwald/flow-react-components/LabeledValue";

export class RemoteLabeledValueElement extends FlowRemoteElement<RemoteLabeledValueElementProps> {
  static get remoteProperties() {
    return {};
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-labeled-value": InstanceType<typeof RemoteLabeledValueElement>;
  }
}

customElements.define("flr-labeled-value", RemoteLabeledValueElement);
