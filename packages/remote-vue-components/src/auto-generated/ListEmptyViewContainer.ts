/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteListEmptyViewContainerElement } from "@mittwald/flow-remote-elements";
import type { RemoteListEmptyViewContainerElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteListEmptyViewContainerElementProps as ListEmptyViewContainerProps } from "@mittwald/flow-remote-elements";

export const ListEmptyViewContainer: FlowRemoteVueComponent<
  RemoteListEmptyViewContainerElementProps,
  "emptySearchResultView" | "emptyView"
> = createFlowRemoteComponent(
  "flr-list-empty-view-container",
  "ListEmptyViewContainer",
  RemoteListEmptyViewContainerElement,
  { slots: ["emptySearchResultView", "emptyView"] },
);
