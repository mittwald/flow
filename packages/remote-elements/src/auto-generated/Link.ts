/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LinkProps } from "@mittwald/flow-react-components/Link";
export type { LinkProps } from "@mittwald/flow-react-components/Link";

export class RemoteLinkElement extends FlowRemoteElement<LinkProps> {
  static get remoteProperties() {
    return {
      inline: {},
      linkComponent: {},
      color: {},
      unstyled: {},
      "aria-current": {},
      isDisabled: {},
      autoFocus: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      style: {},
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
    };
  }

  static get remoteEvents() {
    return {
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
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-link": InstanceType<typeof RemoteLinkElement>;
  }
}

customElements.define("flr-link", RemoteLinkElement);
