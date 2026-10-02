/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteYAxisElement } from "@mittwald/flow-remote-elements";
import type { RemoteYAxisElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteYAxisElementProps as YAxisProps } from "@mittwald/flow-remote-elements";

export const YAxis: FlowRemoteVueComponent<RemoteYAxisElementProps> =
  createFlowRemoteComponent("flr-y-axis", "YAxis", RemoteYAxisElement, {
    booleans: ["allowDecimals", "hide"],
  });
