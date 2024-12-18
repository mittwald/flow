/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TableProps } from "@mittwald/flow-react-components/Table";
export type { TableProps } from "@mittwald/flow-react-components/Table";

export const RemoteTableElement = createRemoteElement<TableProps>({
  properties: {
    children: {},
    selectionBehavior: {},
    disabledBehavior: {},
    dragAndDropHooks: {},
    selectedKeys: {},
    defaultSelectedKeys: {},
    disabledKeys: {},
    selectionMode: {},
    disallowEmptySelection: {},
    sortDescriptor: {},
    className: {},
    style: {},
    slot: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    verticalAlign: {},
  },
  events: {
    rowAction: {},
    selectionChange: {},
    sortChange: {},
    scroll: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-table": InstanceType<typeof RemoteTableElement>;
  }
}

customElements.define("flr-table", RemoteTableElement);
