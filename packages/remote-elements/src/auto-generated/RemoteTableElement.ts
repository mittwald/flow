/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableProps as RemoteTableElementProps } from "@mittwald/flow-react-components/Table";
export type { TableProps as RemoteTableElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableElement extends FlowRemoteElement<RemoteTableElementProps> {
  static get remoteProperties() {
    return {
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
    };
  }

  static get remoteEvents() {
    return {
      rowAction: {},
      selectionChange: {},
      sortChange: {},
      scroll: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-table": InstanceType<typeof RemoteTableElement>;
  }
}

customElements.define("flr-table", RemoteTableElement);
