/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteBreadcrumbElement } from "@mittwald/flow-remote-elements";
export type { RemoteBreadcrumbElement } from "@mittwald/flow-remote-elements";

export const Breadcrumb = createFlowRemoteComponent(
  "flr-breadcrumb",
  "Breadcrumb",
  {
    clearPropsContext: true,
  },
  RemoteBreadcrumbElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onAction: { event: "action" } as never,
    },
  },
);
