/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteAvatarStackElement } from "@mittwald/flow-remote-elements";
export { type RemoteAvatarStackElement } from "@mittwald/flow-remote-elements";

export const AvatarStack = createFlowRemoteComponent(
  "flr-avatar-stack",
  "AvatarStack",
  RemoteAvatarStackElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onCountPress: { event: "countPress" } as never,
    },
  },
);
