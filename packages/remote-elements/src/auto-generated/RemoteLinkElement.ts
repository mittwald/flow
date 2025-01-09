/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components/Link";
export type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components/Link";

export class RemoteLinkElement extends FlowRemoteElement<RemoteLinkElementProps> {
  static get remoteProperties() {
    return {
      inline: {},
      linkComponent: {},
      color: {},
      unstyled: {},
      "aria-current": {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
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
