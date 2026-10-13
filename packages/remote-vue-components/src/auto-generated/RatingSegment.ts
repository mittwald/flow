/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteRatingSegmentElement } from "@mittwald/flow-remote-elements";
import type { RemoteRatingSegmentElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteRatingSegmentElementProps as RatingSegmentProps } from "@mittwald/flow-remote-elements";

export const RatingSegment: FlowRemoteVueComponent<
  RemoteRatingSegmentElementProps,
  "iconEmpty" | "iconFilled"
> = createFlowRemoteComponent(
  "flr-rating-segment",
  "RatingSegment",
  RemoteRatingSegmentElement,
  {
    slots: ["iconEmpty", "iconFilled"],
    booleans: ["autoFocus", "hidden", "inert", "isDisabled"],
  },
);
