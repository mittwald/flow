/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTableRowElement } from "@mittwald/flow-remote-elements";
import type { RemoteTableRowElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTableRowElementProps as TableRowProps } from "@mittwald/flow-remote-elements";

export const TableRow: FlowRemoteVueComponent<RemoteTableRowElementProps> =
  createFlowRemoteComponent(
    "flr-table-row",
    "TableRow",
    RemoteTableRowElement,
    { booleans: ["footer", "hasChildItems", "hidden", "inert", "isDisabled"] },
  );
