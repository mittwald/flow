/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTabsElement } from "@mittwald/flow-remote-elements";
export { type RemoteTabsElement } from "@mittwald/flow-remote-elements";

export const Tabs = createFlowRemoteComponent(
  "flr-tabs",
  "Tabs",
  {
    clearPropsContext: false,
  },
  RemoteTabsElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
