/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTabTitleElement } from "@mittwald/flow-remote-elements";
export { type RemoteTabTitleElement } from "@mittwald/flow-remote-elements";

export const TabTitle = createFlowRemoteComponent(
  "flr-tab-title",
  "TabTitle",
  {
    clearPropsContext: false,
  },
  RemoteTabTitleElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onHoverChange: { event: "hoverChange" } as never,
      onHoverEnd: { event: "hoverEnd" } as never,
      onHoverStart: { event: "hoverStart" } as never,
    },
  },
);
