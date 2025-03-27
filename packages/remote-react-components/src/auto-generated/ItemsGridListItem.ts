/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteItemsGridListItemElement } from "@mittwald/flow-remote-elements";
export { type RemoteItemsGridListItemElement } from "@mittwald/flow-remote-elements";

export const ItemsGridListItem = createFlowRemoteComponent(
  "flr-items-grid-list-item",
  "ItemsGridListItem",
  {
    clearPropsContext: false,
  },
  RemoteItemsGridListItemElement,
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
