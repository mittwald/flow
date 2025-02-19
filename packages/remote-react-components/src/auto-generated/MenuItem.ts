/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteMenuItemElement } from "@mittwald/flow-remote-elements";
export { type RemoteMenuItemElement } from "@mittwald/flow-remote-elements";

export const MenuItem = createFlowRemoteComponent(
  "flr-menu-item",
  "MenuItem",
  {
    clearPropsContext: false,
  },
  RemoteMenuItemElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onHoverChange: { event: "hoverChange" } as never,
      onHoverEnd: { event: "hoverEnd" } as never,
      onHoverStart: { event: "hoverStart" } as never,
    },
  },
);
