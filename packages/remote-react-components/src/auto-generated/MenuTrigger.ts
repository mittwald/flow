/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteMenuTriggerElement } from "@mittwald/flow-remote-elements";
export { type RemoteMenuTriggerElement } from "@mittwald/flow-remote-elements";

export const MenuTrigger = createFlowRemoteComponent(
  "flr-menu-trigger",
  "MenuTrigger",
  RemoteMenuTriggerElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
