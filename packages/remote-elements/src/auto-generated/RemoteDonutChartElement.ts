/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { DonutChartProps as RemoteDonutChartElementProps } from "@mittwald/flow-react-components";
export type { DonutChartProps as RemoteDonutChartElementProps } from "@mittwald/flow-react-components";

export class RemoteDonutChartElement extends FlowRemoteElement<RemoteDonutChartElementProps> {
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
      segments: {},
      showLegend: {},
      size: {},
      slot: {},
      status: {},
      value: {},
      valueText: {},
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
    "flr-donut-chart": InstanceType<typeof RemoteDonutChartElement>;
  }
}

customElements.define("flr-donut-chart", RemoteDonutChartElement);
