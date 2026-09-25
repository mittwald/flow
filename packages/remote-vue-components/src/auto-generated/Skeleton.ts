/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSkeletonElement } from "@mittwald/flow-remote-elements";
import type { RemoteSkeletonElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSkeletonElementProps as SkeletonProps } from "@mittwald/flow-remote-elements";

export const Skeleton: FlowRemoteVueComponent<RemoteSkeletonElementProps> =
  createFlowRemoteComponent("flr-skeleton", "Skeleton", RemoteSkeletonElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "hidden",
      "inert",
      "itemScope",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
