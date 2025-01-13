/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components/Table";
export type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableBodyElement extends FlowRemoteElement<RemoteTableBodyElementProps> {
  static get remoteProperties() {
    return {
      dependencies: {},
      disabledKeys: {},
      items: {},
      renderEmptyState: {},
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
    "flr-table-body": InstanceType<typeof RemoteTableBodyElement>;
  }
}

customElements.define("flr-table-body", RemoteTableBodyElement);
