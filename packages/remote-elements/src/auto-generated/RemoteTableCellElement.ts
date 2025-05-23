/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components";
export type { TableCellProps as RemoteTableCellElementProps } from "@mittwald/flow-react-components";

export class RemoteTableCellElement extends FlowRemoteElement<RemoteTableCellElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      colSpan: {},
      horizontalAlign: {},
      id: {},
      rowHeader: {},
      textValue: {},
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
    "flr-table-cell": InstanceType<typeof RemoteTableCellElement>;
  }
}

customElements.define("flr-table-cell", RemoteTableCellElement);
