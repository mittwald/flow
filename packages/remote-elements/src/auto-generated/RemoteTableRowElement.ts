/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components";
export type { TableRowProps as RemoteTableRowElementProps } from "@mittwald/flow-react-components";

export class RemoteTableRowElement extends FlowRemoteElement<RemoteTableRowElementProps> {
  static override get remoteAttributes() {
    return ["style"];
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
    "flr-table-row": InstanceType<typeof RemoteTableRowElement>;
  }
}

customElements.define("flr-table-row", RemoteTableRowElement);
