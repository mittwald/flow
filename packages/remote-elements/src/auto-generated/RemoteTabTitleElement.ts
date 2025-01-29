/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabTitleProps as RemoteTabTitleElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabTitleElement extends FlowRemoteElement<RemoteTabTitleElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
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

  static override get remoteEvents() {
    return {
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-tab-title": InstanceType<typeof RemoteTabTitleElement>;
  }
}

customElements.define("flr-tab-title", RemoteTabTitleElement);
