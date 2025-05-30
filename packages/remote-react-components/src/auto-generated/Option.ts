/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteOptionElement } from "@mittwald/flow-remote-elements";
export { type RemoteOptionElement } from "@mittwald/flow-remote-elements";

export const Option = createFlowRemoteComponent(
  "flr-option",
  "Option",
  {
    clearPropsContext: false,
  },
  RemoteOptionElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onHoverChange: { event: "hoverChange" } as never,
      onHoverEnd: { event: "hoverEnd" } as never,
      onHoverStart: { event: "hoverStart" } as never,
    },
  },
);
