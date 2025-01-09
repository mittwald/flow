/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components/Table";
export type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableRowElement extends FlowRemoteElement<RemoteTableRowElementProps> {
  static get remoteProperties() {
    return {
      id: {},
      columns: {},
      value: {},
      dependencies: {},
      textValue: {},
      isDisabled: {},
      className: {},
      style: {},
      href: {},
      hrefLang: {},
      target: {},
      rel: {},
      download: {},
      ping: {},
      referrerPolicy: {},
      routerOptions: {},
      footer: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
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
    "flr-table-row": InstanceType<typeof RemoteTableRowElement>;
  }
}

customElements.define("flr-table-row", RemoteTableRowElement);
