/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components";
export type { LinkProps as RemoteLinkElementProps } from "@mittwald/flow-react-components";

export class RemoteLinkElement extends FlowRemoteElement<RemoteLinkElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-current": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
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
      slot: {},
      target: {},
      unstyled: {},
    };
  }

  static override get remoteEvents() {
    return {
      blur: {},
      click: {},
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

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-link": InstanceType<typeof RemoteLinkElement>;
  }
}

customElements.define("flr-link", RemoteLinkElement);
