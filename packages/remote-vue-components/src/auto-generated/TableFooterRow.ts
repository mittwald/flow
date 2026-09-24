/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTableFooterRowElement } from "@mittwald/flow-remote-elements";
import type { RemoteTableFooterRowElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTableFooterRowElementProps as TableFooterRowProps } from "@mittwald/flow-remote-elements";

export const TableFooterRow: FlowRemoteVueComponent<RemoteTableFooterRowElementProps> =
  createFlowRemoteComponent(
    "flr-table-footer-row",
    "TableFooterRow",
    RemoteTableFooterRowElement,
    { booleans: ["footer", "hasChildItems", "hidden", "inert", "isDisabled"] },
  );
