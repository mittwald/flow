/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteContextMenuTriggerElement } from "@mittwald/flow-remote-elements";
import type { RemoteContextMenuTriggerElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteContextMenuTriggerElementProps as ContextMenuTriggerProps } from "@mittwald/flow-remote-elements";

export const ContextMenuTrigger: FlowRemoteVueComponent<RemoteContextMenuTriggerElementProps> =
  createFlowRemoteComponent(
    "flr-context-menu-trigger",
    "ContextMenuTrigger",
    RemoteContextMenuTriggerElement,
    { booleans: ["isDefaultOpen"] },
  );
