/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTableFooterRowElement } from "@mittwald/flow-remote-elements";
export { type RemoteTableFooterRowElement } from "@mittwald/flow-remote-elements";

export const TableFooterRow = createFlowRemoteComponent(
  "flr-table-footer-row",
  "TableFooterRow",
  {
    clearPropsContext: false,
  },
  RemoteTableFooterRowElement,
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
