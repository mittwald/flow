/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSegmentElement } from "@mittwald/flow-remote-elements";
import type { RemoteSegmentElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSegmentElementProps as SegmentProps } from "@mittwald/flow-remote-elements";

export const Segment: FlowRemoteVueComponent<RemoteSegmentElementProps> =
  createFlowRemoteComponent("flr-segment", "Segment", RemoteSegmentElement, {
    booleans: ["autoFocus", "hidden", "inert", "isDisabled"],
  });
