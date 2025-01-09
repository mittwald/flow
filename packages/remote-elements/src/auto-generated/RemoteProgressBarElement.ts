/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components/ProgressBar";
export type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components/ProgressBar";

export class RemoteProgressBarElement extends FlowRemoteElement<RemoteProgressBarElementProps> {
  static get remoteProperties() {
    return {
      showMaxValue: {},
      size: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
      minValue: {},
      maxValue: {},
      value: {},
      id: {},
      slot: {},
      isIndeterminate: {},
      formatOptions: {},
      valueLabel: {},
      status: {},
    };
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
    "flr-progress-bar": InstanceType<typeof RemoteProgressBarElement>;
  }
}

customElements.define("flr-progress-bar", RemoteProgressBarElement);
