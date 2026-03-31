/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CartesianChartProps as RemoteCartesianChartElementProps } from "@mittwald/flow-react-components";
export type { CartesianChartProps as RemoteCartesianChartElementProps } from "@mittwald/flow-react-components";

export class RemoteCartesianChartElement extends FlowRemoteElement<RemoteCartesianChartElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      data: {},
      flexGrow: {},
      height: {},
      syncId: {},
      syncMethod: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return ["emptyView"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-cartesian-chart": InstanceType<typeof RemoteCartesianChartElement>;
  }
}

customElements.define("flr-cartesian-chart", RemoteCartesianChartElement);
