/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components/MenuItem";
export type { MenuItemProps as RemoteMenuItemElementProps } from "@mittwald/flow-react-components/MenuItem";

export class RemoteMenuItemElement extends FlowRemoteElement<RemoteMenuItemElementProps> {
  static get remoteProperties() {
    return {
      selectionVariant: {},
      "aria-label": {},
      className: {},
      style: {},
      isDisabled: {},
      value: {},
      id: {},
      rel: {},
      target: {},
      href: {},
      download: {},
      hrefLang: {},
      ping: {},
      referrerPolicy: {},
      routerOptions: {},
      textValue: {},
      wrapWith: {},
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
    "flr-menu-item": InstanceType<typeof RemoteMenuItemElement>;
  }
}

customElements.define("flr-menu-item", RemoteMenuItemElement);
