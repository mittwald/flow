/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteBadgeElement } from "@mittwald/flow-remote-elements";
export { type RemoteBadgeElement } from "@mittwald/flow-remote-elements";

export const Badge = createFlowRemoteComponent(
  "flr-badge",
  "Badge",
  {
    clearPropsContext: true,
  },
  RemoteBadgeElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onClose: { event: "close" } as never,
      onPress: { event: "press" } as never,
    },
  },
);
