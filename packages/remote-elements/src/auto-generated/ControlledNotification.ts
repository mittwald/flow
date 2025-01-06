/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ControlledNotificationProps } from "@mittwald/flow-react-components/ControlledNotification";
export type { ControlledNotificationProps } from "@mittwald/flow-react-components/ControlledNotification";

export class RemoteControlledNotificationElement extends FlowRemoteElement<ControlledNotificationProps> {
  static get remoteProperties() {
    return {
      notification: {},
      controller: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-controlled-notification": InstanceType<
      typeof RemoteControlledNotificationElement
    >;
  }
}

customElements.define(
  "flr-controlled-notification",
  RemoteControlledNotificationElement,
);
