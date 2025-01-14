/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { NotificationProviderProps as RemoteNotificationProviderElementProps } from "@mittwald/flow-react-components/NotificationProvider";
export type { NotificationProviderProps as RemoteNotificationProviderElementProps } from "@mittwald/flow-react-components/NotificationProvider";

export class RemoteNotificationProviderElement extends FlowRemoteElement<RemoteNotificationProviderElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-notification-provider": InstanceType<
      typeof RemoteNotificationProviderElement
    >;
  }
}

customElements.define(
  "flr-notification-provider",
  RemoteNotificationProviderElement,
);
