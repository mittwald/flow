/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteActionGroupElement } from "@mittwald/flow-remote-elements";
import type { RemoteActionGroupElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteActionGroupElementProps as ActionGroupProps } from "@mittwald/flow-remote-elements";

export const ActionGroup: FlowRemoteVueComponent<RemoteActionGroupElementProps> =
  createFlowRemoteComponent(
    "flr-action-group",
    "ActionGroup",
    RemoteActionGroupElement,
    { booleans: ["preserveOrder"] },
  );
