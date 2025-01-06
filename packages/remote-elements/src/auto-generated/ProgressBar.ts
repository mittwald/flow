/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ProgressBarProps } from "@mittwald/flow-react-components/ProgressBar";
export type { ProgressBarProps } from "@mittwald/flow-react-components/ProgressBar";

export class RemoteProgressBarElement extends FlowRemoteElement<ProgressBarProps> {
  static get remoteProperties() {
    return {
      showMaxValue: {},
      size: {},
      minValue: {},
      maxValue: {},
      value: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      className: {},
      style: {},
      slot: {},
      isIndeterminate: {},
      formatOptions: {},
      valueLabel: {},
      children: {},
      status: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-progress-bar": InstanceType<typeof RemoteProgressBarElement>;
  }
}

customElements.define("flr-progress-bar", RemoteProgressBarElement);
