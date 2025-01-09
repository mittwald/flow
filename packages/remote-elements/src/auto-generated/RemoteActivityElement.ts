/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActivityProps as RemoteActivityElementProps } from "@mittwald/flow-react-components/Activity";
export type { ActivityProps as RemoteActivityElementProps } from "@mittwald/flow-react-components/Activity";

export class RemoteActivityElement extends FlowRemoteElement<RemoteActivityElementProps> {
  static get remoteProperties() {
    return {
      isActive: {},
      inactiveDelay: {},
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
    "flr-activity": InstanceType<typeof RemoteActivityElement>;
  }
}

customElements.define("flr-activity", RemoteActivityElement);
