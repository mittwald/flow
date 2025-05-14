/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AreaChartProps as RemoteAreaChartElementProps } from "@mittwald/flow-react-components";
export type { AreaChartProps as RemoteAreaChartElementProps } from "@mittwald/flow-react-components";

export class RemoteAreaChartElement extends FlowRemoteElement<RemoteAreaChartElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      data: {},
      emptyView: {},
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
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-area-chart": InstanceType<typeof RemoteAreaChartElement>;
  }
}

customElements.define("flr-area-chart", RemoteAreaChartElement);
