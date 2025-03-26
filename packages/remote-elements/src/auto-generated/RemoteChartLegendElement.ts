/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ChartLegendProps as RemoteChartLegendElementProps } from "@mittwald/flow-react-components";
export type { ChartLegendProps as RemoteChartLegendElementProps } from "@mittwald/flow-react-components";

export class RemoteChartLegendElement extends FlowRemoteElement<RemoteChartLegendElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      formatter: {},
      verticalAlign: {},
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
    "flr-chart-legend": InstanceType<typeof RemoteChartLegendElement>;
  }
}

customElements.define("flr-chart-legend", RemoteChartLegendElement);
