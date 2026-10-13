/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSkeletonModeElement } from "@mittwald/flow-remote-elements";
import type { RemoteSkeletonModeElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSkeletonModeElementProps as SkeletonModeProps } from "@mittwald/flow-remote-elements";

export const SkeletonMode: FlowRemoteVueComponent<RemoteSkeletonModeElementProps> =
  createFlowRemoteComponent(
    "flr-skeleton-mode",
    "SkeletonMode",
    RemoteSkeletonModeElement,
    { booleans: ["isEnabled"] },
  );
