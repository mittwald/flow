/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { LinkProps } from "@mittwald/flow-react-components/Link";
export type { LinkProps } from "@mittwald/flow-react-components/Link";

export const RemoteLinkElement = createRemoteElement<LinkProps>({
  properties: {
    inline: {},
    linkComponent: {},
    color: {},
    unstyled: {},
    "aria-current": {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    style: {},
    isDisabled: {},
    autoFocus: {},
    rel: {},
    target: {},
    href: {},
    download: {},
    hrefLang: {},
    ping: {},
    referrerPolicy: {},
    routerOptions: {},
    children: {},
    wrapWith: {},
    className: {},
    ref: {},
    key: {},
  },
  events: {
    focus: {},
    blur: {},
    focusChange: {},
    keyDown: {},
    keyUp: {},
    press: {},
    pressStart: {},
    pressEnd: {},
    pressChange: {},
    pressUp: {},
    hoverStart: {},
    hoverEnd: {},
    hoverChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-link": InstanceType<typeof RemoteLinkElement>;
  }
}

customElements.define("flr-link", RemoteLinkElement);
