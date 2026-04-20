/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ChartGridProps as RemoteChartGridElementProps } from "@mittwald/flow-react-components";
export type { ChartGridProps as RemoteChartGridElementProps } from "@mittwald/flow-react-components";

export class RemoteChartGridElement extends FlowRemoteElement<RemoteChartGridElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      horizontal: {},
      strokeDasharray: {},
      vertical: {},
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
    "flr-chart-grid": InstanceType<typeof RemoteChartGridElement>;
  }
}

customElements.define("flr-chart-grid", RemoteChartGridElement);
