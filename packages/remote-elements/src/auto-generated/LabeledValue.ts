/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LabeledValueProps } from "@mittwald/flow-react-components/LabeledValue";
export type { LabeledValueProps } from "@mittwald/flow-react-components/LabeledValue";

export class RemoteLabeledValueElement extends FlowRemoteElement<LabeledValueProps> {
  static get remoteProperties() {
    return {
      children: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-labeled-value": InstanceType<typeof RemoteLabeledValueElement>;
  }
}

customElements.define("flr-labeled-value", RemoteLabeledValueElement);
