/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSkeletonTextElement } from "@mittwald/flow-remote-elements";
import type { RemoteSkeletonTextElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSkeletonTextElementProps as SkeletonTextProps } from "@mittwald/flow-remote-elements";

export const SkeletonText: FlowRemoteVueComponent<RemoteSkeletonTextElementProps> =
  createFlowRemoteComponent(
    "flr-skeleton-text",
    "SkeletonText",
    RemoteSkeletonTextElement,
    {
      booleans: [
        "autoFocus",
        "defaultChecked",
        "hidden",
        "inert",
        "itemScope",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
      ],
    },
  );
