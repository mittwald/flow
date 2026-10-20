/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTableHeaderElement } from "@mittwald/flow-remote-elements";
import type { RemoteTableHeaderElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTableHeaderElementProps as TableHeaderProps } from "@mittwald/flow-remote-elements";

export const TableHeader: FlowRemoteVueComponent<RemoteTableHeaderElementProps> =
  createFlowRemoteComponent(
    "flr-table-header",
    "TableHeader",
    RemoteTableHeaderElement,
    { booleans: ["hidden", "inert"] },
  );
