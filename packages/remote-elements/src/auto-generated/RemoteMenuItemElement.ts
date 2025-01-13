/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components/MenuItem";
export type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components/MenuItem";

export class RemoteMenuItemElement extends FlowRemoteElement<RemoteMenuItemElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      download: {},
      href: {},
      hrefLang: {},
      id: {},
      isDisabled: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      selectionVariant: {},
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
    "flr-menu-item": InstanceType<typeof RemoteMenuItemElement>;
  }
}

customElements.define("flr-menu-item", RemoteMenuItemElement);
