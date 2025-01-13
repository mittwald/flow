/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableProps as RemoteTableElementProps } from "@mittwald/flow-react-components/Table";
export type { TableProps as RemoteTableElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableElement extends FlowRemoteElement<RemoteTableElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      defaultSelectedKeys: {},
      disabledBehavior: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      dragAndDropHooks: {},
      selectedKeys: {},
      selectionBehavior: {},
      selectionMode: {},
      slot: {},
      sortDescriptor: {},
      verticalAlign: {},
    };
  }

  static get remoteEvents() {
    return {
      rowAction: {},
      scroll: {},
      selectionChange: {},
      sortChange: {},
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
