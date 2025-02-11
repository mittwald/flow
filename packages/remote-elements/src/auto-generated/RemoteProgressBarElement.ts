/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components";
export type { ProgressBarProps as RemoteProgressBarElementProps } from "@mittwald/flow-react-components";

export class RemoteProgressBarElement extends FlowRemoteElement<RemoteProgressBarElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
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

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return ["valueLabel"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-progress-bar": InstanceType<typeof RemoteProgressBarElement>;
  }
}

customElements.define("flr-progress-bar", RemoteProgressBarElement);
