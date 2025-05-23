/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteContextualHelpElement } from "@mittwald/flow-remote-elements";
export { type RemoteContextualHelpElement } from "@mittwald/flow-remote-elements";

export const ContextualHelp = createFlowRemoteComponent(
  "flr-contextual-help",
  "ContextualHelp",
  {
    clearPropsContext: true,
  },
  RemoteContextualHelpElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
