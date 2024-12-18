/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { LabeledValueProps } from "@mittwald/flow-react-components/LabeledValue";
export type { LabeledValueProps } from "@mittwald/flow-react-components/LabeledValue";

export const RemoteLabeledValueElement = createRemoteElement<LabeledValueProps>(
  {
    properties: {
      children: {},
      className: {},
    },
    events: {},
  },
);

declare global {
  interface HTMLElementTagNameMap {
    "flr-labeled-value": InstanceType<typeof RemoteLabeledValueElement>;
  }
}

customElements.define("flr-labeled-value", RemoteLabeledValueElement);
