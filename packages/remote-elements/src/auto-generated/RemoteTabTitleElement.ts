/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabTitleElement extends FlowRemoteElement<RemoteTabTitleElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
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
    "flr-tab-title": InstanceType<typeof RemoteTabTitleElement>;
  }
}

customElements.define("flr-tab-title", RemoteTabTitleElement);
