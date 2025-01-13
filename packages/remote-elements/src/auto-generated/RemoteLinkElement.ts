/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components/Link";
export type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components/Link";

export class RemoteLinkElement extends FlowRemoteElement<RemoteLinkElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-current": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      color: {},
      download: {},
      href: {},
      hrefLang: {},
      inline: {},
      isDisabled: {},
      linkComponent: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      target: {},
      unstyled: {},
    };
  }

  static get remoteEvents() {
    return {
      blur: {},
      focus: {},
      focusChange: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
      keyDown: {},
      keyUp: {},
      press: {},
      pressChange: {},
      pressEnd: {},
      pressStart: {},
      pressUp: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-link": InstanceType<typeof RemoteLinkElement>;
  }
}

customElements.define("flr-link", RemoteLinkElement);
