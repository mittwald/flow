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
      accessibilityLayer: {},
      barCategoryGap: {},
      barGap: {},
      barSize: {},
      className: {},
      compact: {},
      cx: {},
      cy: {},
      data: {},
      dataKey: {},
      desc: {},
      endAngle: {},
      height: {},
      id: {},
      innerRadius: {},
      layout: {},
      margin: {},
      maxBarSize: {},
      outerRadius: {},
      reverseStackOrder: {},
      role: {},
      stackOffset: {},
      startAngle: {},
      syncId: {},
      syncMethod: {},
      tabIndex: {},
      throttleDelay: {},
      title: {},
      width: {},
    };
  }

  static override get remoteEvents() {
    return {
      click: {},
      contextMenu: {},
      doubleClick: {},
      mouseDown: {},
      mouseEnter: {},
      mouseLeave: {},
      mouseMove: {},
      mouseUp: {},
      touchEnd: {},
      touchMove: {},
      touchStart: {},
    };
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
