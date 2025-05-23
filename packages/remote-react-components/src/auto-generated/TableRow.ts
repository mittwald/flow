/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTableRowElement } from "@mittwald/flow-remote-elements";
export { type RemoteTableRowElement } from "@mittwald/flow-remote-elements";

export const TableRow = createFlowRemoteComponent(
  "flr-table-row",
  "TableRow",
  {
    clearPropsContext: false,
  },
  RemoteTableRowElement,
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
