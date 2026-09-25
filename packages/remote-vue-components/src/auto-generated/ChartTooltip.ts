/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteChartTooltipElement } from "@mittwald/flow-remote-elements";
import type { RemoteChartTooltipElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteChartTooltipElementProps as ChartTooltipProps } from "@mittwald/flow-remote-elements";

export const ChartTooltip: FlowRemoteVueComponent<RemoteChartTooltipElementProps> =
  createFlowRemoteComponent(
    "flr-chart-tooltip",
    "ChartTooltip",
    RemoteChartTooltipElement,
    { booleans: ["showProgressBar"] },
  );
