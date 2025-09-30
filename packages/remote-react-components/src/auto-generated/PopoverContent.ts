/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemotePopoverContentElement } from "@mittwald/flow-remote-elements";
export { type RemotePopoverContentElement } from "@mittwald/flow-remote-elements";

export const PopoverContent = createFlowRemoteComponent(
  "flr-popover-content",
  "PopoverContent",
  RemotePopoverContentElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
