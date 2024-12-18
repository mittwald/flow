/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { MenuItemProps } from "@mittwald/flow-react-components/MenuItem";
export type { MenuItemProps } from "@mittwald/flow-react-components/MenuItem";

export const RemoteMenuItemElement = createRemoteElement<MenuItemProps>({
  properties: {
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
    children: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {
    action: {},
    hoverStart: {},
    hoverEnd: {},
    hoverChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-menu-item": InstanceType<typeof RemoteMenuItemElement>;
  }
}

customElements.define("flr-menu-item", RemoteMenuItemElement);
