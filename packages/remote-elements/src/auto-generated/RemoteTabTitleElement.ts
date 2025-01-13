/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabTitleElement extends FlowRemoteElement<RemoteTabTitleElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      download: {},
      href: {},
      hrefLang: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      target: {},
    };
  }

  static get remoteEvents() {
    return {
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
    "flr-tab-title": InstanceType<typeof RemoteTabTitleElement>;
  }
}

customElements.define("flr-tab-title", RemoteTabTitleElement);
