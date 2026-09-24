/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTableElement } from "@mittwald/flow-remote-elements";
import type { RemoteTableElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTableElementProps as TableProps } from "@mittwald/flow-remote-elements";

export const Table: FlowRemoteVueComponent<RemoteTableElementProps> =
  createFlowRemoteComponent("flr-table", "Table", RemoteTableElement, {
    booleans: [
      "disallowEmptySelection",
      "hidden",
      "inert",
      "shouldSelectOnPressUp",
    ],
  });
