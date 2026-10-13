/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteListItemViewContentElement } from "@mittwald/flow-remote-elements";
import type { RemoteListItemViewContentElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteListItemViewContentElementProps as ListItemViewContentProps } from "@mittwald/flow-remote-elements";

export const ListItemViewContent: FlowRemoteVueComponent<
  RemoteListItemViewContentElementProps,
  "avatar" | "bottom" | "button" | "checkbox" | "subTitle" | "title"
> = createFlowRemoteComponent(
  "flr-list-item-view-content",
  "ListItemViewContent",
  RemoteListItemViewContentElement,
  { slots: ["avatar", "bottom", "button", "checkbox", "subTitle", "title"] },
);
