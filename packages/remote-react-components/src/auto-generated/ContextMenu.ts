/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "~/lib/createFlowRemoteComponent";
import { RemoteContextMenuElement } from "@mittwald/flow-remote-elements";

export const ContextMenu = createFlowRemoteComponent(
  "flr-context-menu",
  "ContextMenu",
  RemoteContextMenuElement,
  {
    slotProps: {
      wrapper: false,
    },

    eventProps: {
      onAction: { event: "action" } as never,
      onOpenChange: { event: "openChange" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
