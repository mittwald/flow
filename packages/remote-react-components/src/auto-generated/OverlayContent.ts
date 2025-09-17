/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteOverlayContentElement } from "@mittwald/flow-remote-elements";
export { type RemoteOverlayContentElement } from "@mittwald/flow-remote-elements";

export const OverlayContent = createFlowRemoteComponent(
  "flr-overlay-content",
  "OverlayContent",
  RemoteOverlayContentElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
