/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ActivityProps as RemoteActivityElementProps } from "@mittwald/flow-react-components/Activity";
export type { ActivityProps as RemoteActivityElementProps } from "@mittwald/flow-react-components/Activity";

export class RemoteActivityElement extends FlowRemoteElement<RemoteActivityElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      inactiveDelay: {},
      isActive: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-activity": InstanceType<typeof RemoteActivityElement>;
  }
}

customElements.define("flr-activity", RemoteActivityElement);
