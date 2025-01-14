/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components/Table";
export type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableBodyElement extends FlowRemoteElement<RemoteTableBodyElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      dependencies: {},
      disabledKeys: {},
      items: {},
      renderEmptyState: {},
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
    "flr-table-body": InstanceType<typeof RemoteTableBodyElement>;
  }
}

customElements.define("flr-table-body", RemoteTableBodyElement);
