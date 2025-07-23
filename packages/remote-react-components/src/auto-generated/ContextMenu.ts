/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteContextMenuElement } from "@mittwald/flow-remote-elements";
export { type RemoteContextMenuElement } from "@mittwald/flow-remote-elements";

export const ContextMenu = createFlowRemoteComponent(
  "flr-context-menu",
  "ContextMenu",
  {
    clearPropsContext: true,
  },
  RemoteContextMenuElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onOpenChange: { event: "openChange" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
