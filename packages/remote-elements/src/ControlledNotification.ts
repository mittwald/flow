/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ControlledNotificationProps } from "@mittwald/flow-react-components/ControlledNotification";
export type { ControlledNotificationProps } from "@mittwald/flow-react-components/ControlledNotification";

export const RemoteControlledNotificationElement =
  createRemoteElement<ControlledNotificationProps>({
    properties: {
      notification: {},
      controller: {},
    },
    events: {},
  });

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
