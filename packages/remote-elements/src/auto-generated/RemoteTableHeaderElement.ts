/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TableHeaderProps as RemoteTableHeaderElementProps } from "@mittwald/flow-react-components/Table";
export type { TableHeaderProps as RemoteTableHeaderElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableHeaderElement extends FlowRemoteElement<RemoteTableHeaderElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      columns: {},
      dependencies: {},
    };
  }

  static override get remoteEvents() {
    return {
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-table-header": InstanceType<typeof RemoteTableHeaderElement>;
  }
}

customElements.define("flr-table-header", RemoteTableHeaderElement);
