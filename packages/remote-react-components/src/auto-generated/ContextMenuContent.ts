/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteContextMenuContentElement } from "@mittwald/flow-remote-elements";
export { type RemoteContextMenuContentElement } from "@mittwald/flow-remote-elements";

export const ContextMenuContent = createFlowRemoteComponent(
  "flr-context-menu-content",
  "ContextMenuContent",
  {
    clearPropsContext: false,
  },
  RemoteContextMenuContentElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onClose: { event: "close" } as never,
      onScroll: { event: "scroll" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
