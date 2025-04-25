/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteTooltipElement } from "@mittwald/flow-remote-elements";
export type { RemoteTooltipElement } from "@mittwald/flow-remote-elements";

export const Tooltip = createFlowRemoteComponent(
  "flr-tooltip",
  "Tooltip",
  {
    clearPropsContext: false,
  },
  RemoteTooltipElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
