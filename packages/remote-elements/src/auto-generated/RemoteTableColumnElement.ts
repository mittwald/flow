/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableColumnProps as RemoteTableColumnElementProps } from "@mittwald/flow-react-components/Table";
export type { TableColumnProps as RemoteTableColumnElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableColumnElement extends FlowRemoteElement<RemoteTableColumnElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      allowsSorting: {},
      defaultWidth: {},
      id: {},
      isRowHeader: {},
      maxWidth: {},
      minWidth: {},
      textValue: {},
      width: {},
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
    "flr-table-column": InstanceType<typeof RemoteTableColumnElement>;
  }
}

customElements.define("flr-table-column", RemoteTableColumnElement);
