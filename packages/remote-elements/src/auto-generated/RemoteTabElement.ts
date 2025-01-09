/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TabProps as RemoteTabElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabProps as RemoteTabElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabElement extends FlowRemoteElement<RemoteTabElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      shouldForceMount: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-tab": InstanceType<typeof RemoteTabElement>;
  }
}

customElements.define("flr-tab", RemoteTabElement);
