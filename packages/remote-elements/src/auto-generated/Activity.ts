/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActivityProps } from "@mittwald/flow-react-components/Activity";
export type { ActivityProps } from "@mittwald/flow-react-components/Activity";

export class RemoteActivityElement extends FlowRemoteElement<ActivityProps> {
  static get remoteProperties() {
    return {
      isActive: {},
      inactiveDelay: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-activity": InstanceType<typeof RemoteActivityElement>;
  }
}

customElements.define("flr-activity", RemoteActivityElement);
