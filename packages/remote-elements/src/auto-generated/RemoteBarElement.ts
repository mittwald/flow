/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BarProps as RemoteBarElementProps } from "@mittwald/flow-react-components";
export type { BarProps as RemoteBarElementProps } from "@mittwald/flow-react-components";

export class RemoteBarElement extends FlowRemoteElement<RemoteBarElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      barSize: {},
      className: {},
      color: {},
      dataKey: {},
      dataKeyLabel: {},
      maxBarSize: {},
      minPointSize: {},
      stackId: {},
      unit: {},
      xAxisId: {},
      yAxisId: {},
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
    "flr-bar": InstanceType<typeof RemoteBarElement>;
  }
}

customElements.define("flr-bar", RemoteBarElement);
