/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components/ProgressBar";
export type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components/ProgressBar";

export class RemoteProgressBarElement extends FlowRemoteElement<RemoteProgressBarElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      formatOptions: {},
      id: {},
      isIndeterminate: {},
      maxValue: {},
      minValue: {},
      showMaxValue: {},
      size: {},
      slot: {},
      status: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return ["valueLabel"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-progress-bar": InstanceType<typeof RemoteProgressBarElement>;
  }
}

customElements.define("flr-progress-bar", RemoteProgressBarElement);
