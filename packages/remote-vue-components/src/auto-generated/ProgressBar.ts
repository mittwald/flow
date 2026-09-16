/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteProgressBarElement } from "@mittwald/flow-remote-elements";
import type { RemoteProgressBarElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteProgressBarElementProps as ProgressBarProps } from "@mittwald/flow-remote-elements";

export const ProgressBar: FlowRemoteVueComponent<
  RemoteProgressBarElementProps,
  "valueLabel"
> = createFlowRemoteComponent(
  "flr-progress-bar",
  "ProgressBar",
  RemoteProgressBarElement,
  { slots: ["valueLabel"] },
);
