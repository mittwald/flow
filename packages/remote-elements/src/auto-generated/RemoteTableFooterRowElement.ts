/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TableFooterRowProps as RemoteTableFooterRowElementProps } from "@mittwald/flow-react-components/Table";
export type { TableFooterRowProps as RemoteTableFooterRowElementProps } from "@mittwald/flow-react-components/Table";

export class RemoteTableFooterRowElement extends FlowRemoteElement<RemoteTableFooterRowElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      className: {},
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

  static override get remoteEvents() {
    return {
      action: {},
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
    "flr-table-footer-row": InstanceType<typeof RemoteTableFooterRowElement>;
  }
}

customElements.define("flr-table-footer-row", RemoteTableFooterRowElement);
