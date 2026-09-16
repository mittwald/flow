/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteItemsGridListElement } from "@mittwald/flow-remote-elements";
import type { RemoteItemsGridListElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteItemsGridListElementProps as ItemsGridListProps } from "@mittwald/flow-remote-elements";

export const ItemsGridList: FlowRemoteVueComponent<
  RemoteItemsGridListElementProps,
  "emptyView"
> = createFlowRemoteComponent(
  "flr-items-grid-list",
  "ItemsGridList",
  RemoteItemsGridListElement,
  { slots: ["emptyView"] },
);
