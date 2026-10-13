/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTableBodyElement } from "@mittwald/flow-remote-elements";
import type { RemoteTableBodyElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTableBodyElementProps as TableBodyProps } from "@mittwald/flow-remote-elements";

export const TableBody: FlowRemoteVueComponent<RemoteTableBodyElementProps> =
  createFlowRemoteComponent(
    "flr-table-body",
    "TableBody",
    RemoteTableBodyElement,
    { booleans: ["hidden", "inert"] },
  );
