/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components";
export type { TableBodyProps as RemoteTableBodyElementProps } from "@mittwald/flow-react-components";

export class RemoteTableBodyElement extends FlowRemoteElement<RemoteTableBodyElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      dependencies: {},
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
