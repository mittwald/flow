/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components/Table";
export type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableCellElement extends FlowRemoteElement<RemoteTableCellElementProps> {
  static get remoteProperties() {
    return {
      rowHeader: {},
      className: {},
      id: {},
      textValue: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-table-cell": InstanceType<typeof RemoteTableCellElement>;
  }
}

customElements.define("flr-table-cell", RemoteTableCellElement);
