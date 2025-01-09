/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableHeaderProps as RemoteTableHeaderElementProps } from "@mittwald/flow-react-components/Table";
export type { TableHeaderProps as RemoteTableHeaderElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableHeaderElement extends FlowRemoteElement<RemoteTableHeaderElementProps> {
  static get remoteProperties() {
    return {
      columns: {},
      dependencies: {},
      className: {},
      style: {},
    };
  }

  static get remoteEvents() {
    return {
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-table-header": InstanceType<typeof RemoteTableHeaderElement>;
  }
}

customElements.define("flr-table-header", RemoteTableHeaderElement);
