/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTableHeaderElement } from "@mittwald/flow-remote-elements";
export { type RemoteTableHeaderElement } from "@mittwald/flow-remote-elements";

export const TableHeader = createFlowRemoteComponent(
  "flr-table-header",
  "TableHeader",
  {
    clearPropsContext: false,
  },
  RemoteTableHeaderElement,
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
