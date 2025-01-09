/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import createFlowRemoteComponent from "@/lib/createFlowRemoteComponent";
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
      onOpenChange: { event: "openChange" } as never,
      onAction: { event: "action" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
