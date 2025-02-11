/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteItemsGridListElement } from "@mittwald/flow-remote-elements";
export { type RemoteItemsGridListElement } from "@mittwald/flow-remote-elements";

export const ItemsGridList = createFlowRemoteComponent(
  "flr-items-grid-list",
  "ItemsGridList",
  {
    clearPropsContext: false,
  },
  RemoteItemsGridListElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onScroll: { event: "scroll" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
