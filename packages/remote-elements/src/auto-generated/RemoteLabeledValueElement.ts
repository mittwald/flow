/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { LabeledValueProps as RemoteLabeledValueElementProps } from "@mittwald/flow-react-components/LabeledValue";
export type { LabeledValueProps as RemoteLabeledValueElementProps } from "@mittwald/flow-react-components/LabeledValue";

export class RemoteLabeledValueElement extends FlowRemoteElement<RemoteLabeledValueElementProps> {
  static override get remoteAttributes() {
    return [];
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
