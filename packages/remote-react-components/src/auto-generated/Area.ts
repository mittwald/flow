/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteAreaElement } from "@mittwald/flow-remote-elements";
export { type RemoteAreaElement } from "@mittwald/flow-remote-elements";

export const Area = createFlowRemoteComponent(
  "flr-area",
  "Area",
  {
    clearPropsContext: false,
  },
  RemoteAreaElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onlyDots: { event: "lyDots" } as never,
    },
  },
);
