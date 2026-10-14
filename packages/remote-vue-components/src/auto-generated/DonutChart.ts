/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteDonutChartElement } from "@mittwald/flow-remote-elements";
import type { RemoteDonutChartElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteDonutChartElementProps as DonutChartProps } from "@mittwald/flow-remote-elements";

export const DonutChart: FlowRemoteVueComponent<RemoteDonutChartElementProps> =
  createFlowRemoteComponent(
    "flr-donut-chart",
    "DonutChart",
    RemoteDonutChartElement,
    { booleans: ["hidden", "inert", "isIndeterminate", "showLegend"] },
  );
