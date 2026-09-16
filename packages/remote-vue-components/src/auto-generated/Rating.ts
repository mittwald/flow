/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteRatingElement } from "@mittwald/flow-remote-elements";
import type { RemoteRatingElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteRatingElementProps as RatingProps } from "@mittwald/flow-remote-elements";

export const Rating: FlowRemoteVueComponent<
  RemoteRatingElementProps,
  "iconEmpty" | "iconFilled"
> = createFlowRemoteComponent("flr-rating", "Rating", RemoteRatingElement, {
  slots: ["iconEmpty", "iconFilled"],
});
