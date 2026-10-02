/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteItemsGridListItemElement } from "@mittwald/flow-remote-elements";
import type { RemoteItemsGridListItemElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteItemsGridListItemElementProps as ItemsGridListItemProps } from "@mittwald/flow-remote-elements";

export const ItemsGridListItem: FlowRemoteVueComponent<RemoteItemsGridListItemElementProps> =
  createFlowRemoteComponent(
    "flr-items-grid-list-item",
    "ItemsGridListItem",
    RemoteItemsGridListItemElement,
    {
      booleans: [
        "allowsArrowNavigation",
        "hasAction",
        "hidden",
        "inert",
        "isDisabled",
        "isTile",
      ],
    },
  );
