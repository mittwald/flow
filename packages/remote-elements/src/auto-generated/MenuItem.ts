/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { MenuItemProps } from "@mittwald/flow-react-components/MenuItem";
export type { MenuItemProps } from "@mittwald/flow-react-components/MenuItem";

export class RemoteMenuItemElement extends FlowRemoteElement<MenuItemProps> {
  static get remoteProperties() {
    return {
      selectionVariant: {},
      isDisabled: {},
      value: {},
      "aria-label": {},
      id: {},
      style: {},
      className: {},
      rel: {},
      target: {},
      href: {},
      download: {},
      hrefLang: {},
      ping: {},
      referrerPolicy: {},
      routerOptions: {},
      textValue: {},
      children: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-menu-item": InstanceType<typeof RemoteMenuItemElement>;
  }
}

customElements.define("flr-menu-item", RemoteMenuItemElement);
