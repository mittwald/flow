/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components/Table";
export type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableRowElement extends FlowRemoteElement<RemoteTableRowElementProps> {
  static get remoteProperties() {
    return {
      columns: {},
      dependencies: {},
      download: {},
      footer: {},
      href: {},
      hrefLang: {},
      id: {},
      isDisabled: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      target: {},
      textValue: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
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
