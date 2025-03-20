/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ChartTooltipProps as RemoteChartTooltipElementProps } from "@mittwald/flow-react-components";
export type { ChartTooltipProps as RemoteChartTooltipElementProps } from "@mittwald/flow-react-components";

export class RemoteChartTooltipElement extends FlowRemoteElement<RemoteChartTooltipElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowEscapeViewBox: {},
      formatter: {},
      headingFormatter: {},
      wrapperClassName: {},
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
    "flr-chart-tooltip": InstanceType<typeof RemoteChartTooltipElement>;
  }
}

customElements.define("flr-chart-tooltip", RemoteChartTooltipElement);
