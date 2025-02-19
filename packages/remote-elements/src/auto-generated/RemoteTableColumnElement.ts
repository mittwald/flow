/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableColumnProps as RemoteTableColumnElementProps } from "@mittwald/flow-react-components";
export type { TableColumnProps as RemoteTableColumnElementProps } from "@mittwald/flow-react-components";

export class RemoteTableColumnElement extends FlowRemoteElement<RemoteTableColumnElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowsSorting: {},
      className: {},
      defaultWidth: {},
      horizontalAlign: {},
      id: {},
      isRowHeader: {},
      maxWidth: {},
      minWidth: {},
      textValue: {},
      width: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-table-column": InstanceType<typeof RemoteTableColumnElement>;
  }
}

customElements.define("flr-table-column", RemoteTableColumnElement);
