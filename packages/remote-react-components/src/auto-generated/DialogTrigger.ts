/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteDialogTriggerElement } from "@mittwald/flow-remote-elements";
export { type RemoteDialogTriggerElement } from "@mittwald/flow-remote-elements";

export const DialogTrigger = createFlowRemoteComponent(
  "flr-dialog-trigger",
  "DialogTrigger",
  RemoteDialogTriggerElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
