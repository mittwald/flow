/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableFooterRowProps as RemoteTableFooterRowElementProps } from "@mittwald/flow-react-components/Table";
export type { TableFooterRowProps as RemoteTableFooterRowElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableFooterRowElement extends FlowRemoteElement<RemoteTableFooterRowElementProps> {
  static get remoteProperties() {
    return {
      id: {},
      columns: {},
      value: {},
      dependencies: {},
      textValue: {},
      isDisabled: {},
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
    "flr-table-footer-row": InstanceType<typeof RemoteTableFooterRowElement>;
  }
}

customElements.define("flr-table-footer-row", RemoteTableFooterRowElement);
