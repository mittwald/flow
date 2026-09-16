/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteCartesianChartElement } from "@mittwald/flow-remote-elements";
import type { RemoteCartesianChartElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteCartesianChartElementProps as CartesianChartProps } from "@mittwald/flow-remote-elements";

export const CartesianChart: FlowRemoteVueComponent<
  RemoteCartesianChartElementProps,
  "emptyView"
> = createFlowRemoteComponent(
  "flr-cartesian-chart",
  "CartesianChart",
  RemoteCartesianChartElement,
  { slots: ["emptyView"] },
);
