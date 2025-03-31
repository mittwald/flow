/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTableElement } from "@mittwald/flow-remote-elements";
export { type RemoteTableElement } from "@mittwald/flow-remote-elements";

export const Table = createFlowRemoteComponent(
  "flr-table",
  "Table",
  {
    clearPropsContext: false,
  },
  RemoteTableElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onRowAction: { event: "rowAction" } as never,
      onScroll: { event: "scroll" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
      onSortChange: { event: "sortChange" } as never,
    },
  },
);
